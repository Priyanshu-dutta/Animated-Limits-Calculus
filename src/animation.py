"""Main animation build script for 'The Mystery of Limits: Getting Closer to a Point'.

Usage:
  python src/animation.py             # Build audio (if needed) + render full 1080p MP4
  python src/animation.py --preview   # Render keyframe PNGs across all 6 scenes for inspection
"""

import argparse
import json
import math
import multiprocessing as mp
import subprocess
from pathlib import Path

import imageio_ffmpeg
from playwright.sync_api import sync_playwright

from config import (
    BUILD_DIR,
    CHROME_EXECUTABLE,
    FPS,
    HEIGHT,
    RENDER_WORKERS,
    SRC_DIR,
    VIDEO_DIR,
    WIDTH,
)
from generate_audio import build_audio_and_timeline


def _render_chunk(args: tuple) -> str:
    worker_id, start_frame, end_frame, timeline_json, html_uri, seg_path_str = args
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    seg_path = Path(seg_path_str)

    ffmpeg_cmd = [
        ffmpeg_exe,
        "-y",
        "-loglevel",
        "error",
        "-f",
        "image2pipe",
        "-vcodec",
        "mjpeg",
        "-framerate",
        str(FPS),
        "-i",
        "-",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "17",
        "-pix_fmt",
        "yuv420p",
        str(seg_path),
    ]

    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    timeline = json.loads(timeline_json)

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_EXECUTABLE, headless=True)
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT}, device_scale_factor=1)
        page.goto(html_uri, wait_until="load")
        page.evaluate("(tl) => window.setTimeline(tl)", timeline)

        total_chunk = end_frame - start_frame
        for idx, frame_idx in enumerate(range(start_frame, end_frame)):
            t = frame_idx / FPS
            page.evaluate("(t) => window.renderAtTime(t)", t)
            img_bytes = page.screenshot(type="jpeg", quality=94)
            proc.stdin.write(img_bytes)
            if (idx + 1) % 300 == 0 or (idx + 1) == total_chunk:
                print(f"  [Worker {worker_id}] {idx + 1}/{total_chunk} frames", flush=True)

        browser.close()

    proc.stdin.close()
    ret = proc.wait()
    if ret != 0:
        raise RuntimeError(f"Worker {worker_id} ffmpeg exited with code {ret}")
    return str(seg_path)


def render_previews(timeline: dict) -> None:
    preview_dir = BUILD_DIR / "previews"
    preview_dir.mkdir(parents=True, exist_ok=True)
    html_uri = (SRC_DIR / "renderer.html").as_uri()

    # Representative timestamps across all 6 scenes
    samples = [
        ("01_title", 3.5),
        ("02_hook_table", 41.5),
        ("03_s2_notation", 67.0),
        ("04_s2_numline", 96.5),
        ("05_s3_graph_hole", 156.5),
        ("06_s4_algebra", 236.0),
        ("07_s5_interpretation", 280.0),
        ("08_s6_takeaways", 312.0),
        ("09_s6_credits", 322.5),
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_EXECUTABLE, headless=True)
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT}, device_scale_factor=1)
        page.goto(html_uri, wait_until="load")
        page.evaluate("(tl) => window.setTimeline(tl)", timeline)
        for name, t in samples:
            page.evaluate("(t) => window.renderAtTime(t)", t)
            out_png = preview_dir / f"{name}.png"
            page.screenshot(path=str(out_png), type="png")
            print(f"Saved preview: {out_png} (t={t:.2f}s)")
        browser.close()


def render_full_video(timeline: dict) -> Path:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    seg_dir = BUILD_DIR / "segments"
    seg_dir.mkdir(parents=True, exist_ok=True)

    total_duration = float(timeline["total_duration"])
    total_frames = int(math.ceil(total_duration * FPS))
    html_uri = (SRC_DIR / "renderer.html").as_uri()
    timeline_json = json.dumps(timeline)

    n_workers = max(1, min(RENDER_WORKERS, total_frames))
    chunk_size = math.ceil(total_frames / n_workers)
    tasks = []
    seg_paths = []
    for w in range(n_workers):
        sf = w * chunk_size
        ef = min(total_frames, (w + 1) * chunk_size)
        if sf >= ef:
            break
        seg_path = seg_dir / f"seg_{w:02d}.mp4"
        seg_paths.append(seg_path)
        tasks.append((w, sf, ef, timeline_json, html_uri, str(seg_path)))

    print(f"Rendering {total_frames} frames ({total_duration:.2f}s @ {FPS}fps) across {len(tasks)} parallel Chrome workers...")
    with mp.Pool(processes=len(tasks)) as pool:
        pool.map(_render_chunk, tasks)

    concat_list = seg_dir / "concat.txt"
    concat_list.write_text(
        "\n".join(f"file '{p.resolve()}'" for p in seg_paths),
        encoding="utf-8",
    )

    video_only = BUILD_DIR / "video_only.mp4"
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run(
        [
            ffmpeg_exe,
            "-y",
            "-loglevel",
            "error",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_list),
            "-c",
            "copy",
            str(video_only),
        ],
        check=True,
    )

    audio_mix = BUILD_DIR / "audio_mix.m4a"
    final_mp4 = VIDEO_DIR / "limits_animation.mp4"
    subprocess.run(
        [
            ffmpeg_exe,
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(video_only),
            "-i",
            str(audio_mix),
            "-c:v",
            "copy",
            "-c:a",
            "copy",
            "-movflags",
            "+faststart",
            "-shortest",
            str(final_mp4),
        ],
        check=True,
    )
    print(f"Final MP4 rendered successfully: {final_mp4}")
    return final_mp4


def main() -> None:
    parser = argparse.ArgumentParser(description="Render M3 Limits Animation Video")
    parser.add_argument("--preview", action="store_true", help="Only render keyframe PNG previews")
    parser.add_argument("--skip-audio", action="store_true", help="Reuse existing timeline.json and audio_mix.m4a")
    args = parser.parse_args()

    timeline_path = BUILD_DIR / "timeline.json"
    audio_path = BUILD_DIR / "audio_mix.m4a"

    if args.skip_audio and timeline_path.exists() and audio_path.exists():
        timeline = json.loads(timeline_path.read_text(encoding="utf-8"))
    else:
        timeline = build_audio_and_timeline()

    if args.preview:
        render_previews(timeline)
    else:
        render_full_video(timeline)


if __name__ == "__main__":
    main()

