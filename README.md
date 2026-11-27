# The Mystery of Limits: Getting Closer to a Point

**Linear Algebra and Calculus (M3) — Internal Assessment Animation Project**

An animated, voice-narrated educational mathematics video explaining **limits and removable discontinuities** using the example:

$$f(x) = \frac{x^2 - 4}{x - 2}, \qquad \lim_{x \to 2} \frac{x^2 - 4}{x - 2} = 4$$

---

## Project Specifications
- **Duration:** ~5 minutes 27 seconds (strictly under the 7-minute limit)
- **Resolution & Format:** 1920×1080 (16:9 landscape), 30 fps, H.264 MP4 (silent visual track ready for presenter voice-over; optional AI TTS + subtitles toggleable in `src/config.py`)
- **Narration Script:** Full timestamped script in `documents/narration_script.md` aligned to every visual cue
- **Visual Stack:** Deterministic HTML5 Canvas 2D + local KaTeX typesetting rendered frame-by-frame in headless Chrome (`Playwright`) and encoded via `FFmpeg` (`imageio-ffmpeg`)

---

## Project Structure

```text
Limits_Animation_Project/
├── video/
│   ├── limits_animation.mp4        # Final 1080p MP4 video
│   └── limits_animation.srt        # Synchronized SRT subtitles
├── src/
│   ├── config.py                   # Student metadata, resolution, FPS, TTS settings
│   ├── script_data.py              # 6-scene narration beats & caption definitions
│   ├── generate_audio.py           # Synthesizes TTS, ambient music, SRT & timeline.json
│   ├── animation.py                # Parallel 1080p frame renderer + FFmpeg muxer
│   ├── renderer.html               # 1080p vector/KaTeX animation stage
│   ├── styles.css                  # Dark navy/cyan/purple typography & card styling
│   ├── scenes.js                   # Deterministic time-driven animation logic
│   └── assets/katex/               # Local offline KaTeX CSS, JS, and fonts
├── documents/
│   ├── storyboard.md               # 6-scene storyboard (Markdown)
│   ├── storyboard.pdf              # 6-scene storyboard (PDF for GitHub submission)
│   └── narration_script.md         # Full timestamped voice-over script
├── requirements.txt
└── README.md
```

---

## Installation & Execution

### 1. Prerequisites
- Python 3.10+
- Google Chrome (installed at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` on macOS, or update `CHROME_EXECUTABLE` in `src/config.py`)
- Internet connection (only needed if regenerating `edge-tts` voice-over audio)

### 2. Install Python Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Customize Your Name & Student ID
Edit `STUDENT_NAME` and `STUDENT_ID` in `src/config.py` so your Opening Title Frame and Closing Credits Frame display your details.

### 4. Build Audio & Render the Final Video
```bash
# Generate narration, ambient background music, timeline.json, and SRT subtitles
python src/generate_audio.py

# Optional: inspect keyframe PNGs across all 6 scenes
python src/animation.py --preview --skip-audio

# Render full 1080p 30fps MP4
python src/animation.py --skip-audio
```
*(Run `python src/animation.py` without `--skip-audio` to rebuild both audio and video in one step.)*

The rendered video will be written to:
`video/limits_animation.mp4`

---

## Six-Scene Overview
1. **Scene 1 — Hook / The Mathematical Mystery:** Opening frame, hook question, testing $f(x)=\frac{x^2-4}{x-2}$ at $x = 1.5, 1.9, 1.99$, and hitting $0/0$ (undefined) at $x = 2$.
2. **Scene 2 — Introducing the Concept of Limits:** Explaining $\lim_{x\to a} f(x)=L$ and animating points approaching $2$ from both sides on a number line.
3. **Scene 3 — Visual Intuition With a Graph:** Plotting $y=x+2$, revealing the removable open hole at $(2,4)$, and animating left & right points gliding toward $(2,4)$.
4. **Scene 4 — Step-by-Step Mathematical Solution:** Direct substitution ($0/0$ indeterminate form), factoring $(x-2)(x+2)$, canceling $(x-2)$ for $x\neq 2$, and evaluating $\lim_{x\to 2}(x+2)=\boxed{4}$.
5. **Scene 5 — Left-Hand, Right-Hand & Interpretation:** Connecting $\lim_{x\to 2^-} f(x)=4$ and $\lim_{x\to 2^+} f(x)=4$ while contrasting $\text{limit}=4$ against $f(2)=\text{Undefined}$.
6. **Scene 6 — Summary, Conclusion & Credits:** Three core takeaways, final boxed result, closing quote, references, music credit, and AI disclosure.

---

## Credits & AI Disclosure
- **Mathematical References:** James Stewart, *Calculus*; OpenStax, *Calculus Volume 1*; visual pedagogy inspired by 3Blue1Brown.
- **Audio & Narration:** Original voice-over narration recorded personally by the presenter (**Priyanshu Dutta**, Student ID: `E25B070654`); no AI-generated voice or background music track is used in the final submitted video.
- **AI Assistance Disclosure:** AI coding and scripting assistance was used to structure the storyboard and author the Python/HTML5 animation pipeline. All mathematical derivations, visual choices, and the final recorded narration are the presenter's own work.

