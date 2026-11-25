"""Generate neural TTS narration, procedural ambient background music, SRT captions,
and the exact audio-driven timeline (build/timeline.json).
"""

import asyncio
import json
import subprocess
import wave
from pathlib import Path

import edge_tts
import imageio_ffmpeg
import numpy as np

from config import BUILD_DIR, MUSIC_VOLUME, STUDENT_ID, STUDENT_NAME, TTS_RATE, TTS_VOICE, VIDEO_DIR
from script_data import SCENES

SAMPLE_RATE = 44100


def _ffmpeg_exe() -> str:
    return imageio_ffmpeg.get_ffmpeg_exe()


def _format_srt_time(seconds: float) -> str:
    ms_total = max(0, int(round(seconds * 1000)))
    hours = ms_total // 3_600_000
    minutes = (ms_total % 3_600_000) // 60_000
    secs = (ms_total % 60_000) // 1000
    ms = ms_total % 1000
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{ms:03d}"


async def _synthesize_beat(sem: asyncio.Semaphore, beat_id: str, text: str, mp3_path: Path) -> None:
    if mp3_path.exists() and mp3_path.stat().st_size > 1000:
        return
    async with sem:
        comm = edge_tts.Communicate(text=text, voice=TTS_VOICE, rate=TTS_RATE)
        await comm.save(str(mp3_path))


async def synthesize_all_beats(tts_dir: Path) -> None:
    tts_dir.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(4)
    tasks = []
    for scene in SCENES:
        for beat in scene["beats"]:
            mp3_path = tts_dir / f"{beat['id']}.mp3"
            tasks.append(_synthesize_beat(sem, beat["id"], beat["narration"], mp3_path))
    await asyncio.gather(*tasks)


def mp3_to_pcm_array(mp3_path: Path, wav_path: Path) -> np.ndarray:
    subprocess.run(
        [
            _ffmpeg_exe(),
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(mp3_path),
            "-ar",
            str(SAMPLE_RATE),
            "-ac",
            "1",
            "-f",
            "wav",
            str(wav_path),
        ],
        check=True,
    )
    with wave.open(str(wav_path), "rb") as wf:
        raw = wf.readframes(wf.getnframes())
    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    return audio


def generate_ambient_music(duration_sec: float, sr: int = SAMPLE_RATE) -> np.ndarray:
    """Synthesize a calm, original ambient chord pad in C major / A minor."""
    n_samples = int(np.ceil(duration_sec * sr))
    t = np.linspace(0.0, duration_sec, n_samples, endpoint=False, dtype=np.float64)

    # Warm chord progression (each chord lasts 8 seconds, crossfaded smoothly)
    chords = [
        [130.81, 196.00, 246.94, 293.66],  # Cmaj9 (C3, G3, B3, D4)
        [110.00, 164.81, 246.94, 261.63],  # Am9   (A2, E3, B3, C4)
        [174.61, 220.00, 261.63, 329.63],  # Fmaj7 (F3, A3, C4, E4)
        [196.00, 246.94, 293.66, 329.63],  # G6    (G3, B3, D4, E4)
    ]
    chord_len = 8.0
    cycle_pos = t / chord_len
    idx_a = np.floor(cycle_pos).astype(int) % len(chords)
    idx_b = (idx_a + 1) % len(chords)
    frac = cycle_pos - np.floor(cycle_pos)
    # Smooth crossfade in the last 2.0 seconds of each 8-second chord bar
    blend = np.clip((frac - 0.75) / 0.25, 0.0, 1.0)
    blend = 0.5 * (1.0 - np.cos(np.pi * blend))

    signal = np.zeros(n_samples, dtype=np.float64)
    for voice_i in range(4):
        freqs_a = np.array([chords[c][voice_i] for c in range(len(chords))])[idx_a]
        freqs_b = np.array([chords[c][voice_i] for c in range(len(chords))])[idx_b]
        phase_a = 2.0 * np.pi * np.cumsum(freqs_a) / sr
        phase_b = 2.0 * np.pi * np.cumsum(freqs_b) / sr
        # Gentle fundamental + soft 2nd harmonic
        wave_a = 0.82 * np.sin(phase_a) + 0.18 * np.sin(2.0 * phase_a)
        wave_b = 0.82 * np.sin(phase_b) + 0.18 * np.sin(2.0 * phase_b)
        voice = (1.0 - blend) * wave_a + blend * wave_b
        # Slow breathing LFO per voice
        lfo = 0.75 + 0.25 * np.sin(2.0 * np.pi * (0.09 + 0.03 * voice_i) * t + voice_i)
        signal += voice * lfo

    signal /= 4.0
    # Fade in 2.5s and fade out 3.0s
    fade_in = np.clip(t / 2.5, 0.0, 1.0)
    fade_out = np.clip((duration_sec - t) / 3.0, 0.0, 1.0)
    signal *= fade_in * fade_out
    return signal.astype(np.float32)


def write_wav_mono(path: Path, samples: np.ndarray, sr: int = SAMPLE_RATE) -> None:
    clipped = np.clip(samples, -1.0, 1.0)
    pcm = (clipped * 32767.0).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(pcm.tobytes())


def build_audio_and_timeline() -> dict:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    tts_dir = BUILD_DIR / "tts"

    print("Synthesizing neural narration beats via edge-tts...")
    asyncio.run(synthesize_all_beats(tts_dir))

    # Lead-in silence (1.2s) for opening title frame breath
    lead_in_samples = int(1.2 * SAMPLE_RATE)
    chunks = [np.zeros(lead_in_samples, dtype=np.float32)]
    cursor = lead_in_samples / SAMPLE_RATE

    timeline_beats = []
    scene_ranges = {}
    srt_entries = []
    srt_idx = 1

    for scene in SCENES:
        s_num = scene["scene"]
        scene_start = cursor
        for beat in scene["beats"]:
            mp3_path = tts_dir / f"{beat['id']}.mp3"
            wav_path = tts_dir / f"{beat['id']}.wav"
            voice_samples = mp3_to_pcm_array(mp3_path, wav_path)
            speak_dur = len(voice_samples) / SAMPLE_RATE
            pause_samples = int(round(beat["pause_after"] * SAMPLE_RATE))

            beat_start = cursor
            speak_end = beat_start + speak_dur
            beat_end = speak_end + (pause_samples / SAMPLE_RATE)

            chunks.append(voice_samples)
            if pause_samples > 0:
                chunks.append(np.zeros(pause_samples, dtype=np.float32))

            timeline_beats.append(
                {
                    "id": beat["id"],
                    "scene": s_num,
                    "start": round(beat_start, 4),
                    "speak_end": round(speak_end, 4),
                    "end": round(beat_end, 4),
                    "caption": beat["caption"],
                }
            )

            srt_entries.append(
                f"{srt_idx}\n"
                f"{_format_srt_time(beat_start)} --> {_format_srt_time(speak_end + 0.15)}\n"
                f"{beat['caption']}\n"
            )
            srt_idx += 1
            cursor = beat_end

        scene_ranges[str(s_num)] = {
            "scene": s_num,
            "title": scene["title"],
            "start": round(scene_start if s_num > 1 else 0.0, 4),
            "end": round(cursor, 4),
        }

    # Trailing credit hold (1.5s)
    tail_samples = int(1.5 * SAMPLE_RATE)
    chunks.append(np.zeros(tail_samples, dtype=np.float32))
    total_duration = cursor + 1.5
    scene_ranges["6"]["end"] = round(total_duration, 4)

    narration_pcm = np.concatenate(chunks)
    # Normalize narration cleanly to -1.5 dBFS peak
    peak = float(np.max(np.abs(narration_pcm))) or 1.0
    narration_pcm = (narration_pcm / peak) * 0.84

    print("Synthesizing subtle ambient background music...")
    music_pcm = generate_ambient_music(len(narration_pcm) / SAMPLE_RATE)
    mixed_pcm = narration_pcm + (MUSIC_VOLUME * music_pcm)
    max_mix = float(np.max(np.abs(mixed_pcm)))
    if max_mix > 0.96:
        mixed_pcm = mixed_pcm * (0.96 / max_mix)

    narration_wav = BUILD_DIR / "narration.wav"
    mixed_wav = BUILD_DIR / "audio_mix.wav"
    mixed_aac = BUILD_DIR / "audio_mix.m4a"
    write_wav_mono(narration_wav, narration_pcm)
    write_wav_mono(mixed_wav, mixed_pcm)

    subprocess.run(
        [
            _ffmpeg_exe(),
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(mixed_wav),
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            str(mixed_aac),
        ],
        check=True,
    )

    srt_path = VIDEO_DIR / "limits_animation.srt"
    srt_path.write_text("\n".join(srt_entries), encoding="utf-8")

    timeline = {
        "total_duration": round(total_duration, 4),
        "student_name": STUDENT_NAME,
        "student_id": STUDENT_ID,
        "scenes": scene_ranges,
        "beats": timeline_beats,
    }
    timeline_path = BUILD_DIR / "timeline.json"
    timeline_path.write_text(json.dumps(timeline, indent=2), encoding="utf-8")

    print(f"\nAudio build complete! Total duration: {total_duration:.2f}s ({total_duration/60:.2f} min)")
    for s_key, info in scene_ranges.items():
        print(f"  Scene {s_key} ({info['title']}): {info['start']:.2f}s -> {info['end']:.2f}s")
    return timeline


if __name__ == "__main__":
    build_audio_and_timeline()

