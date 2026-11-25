"""Central configuration for the Limits Animation Project.

Edit STUDENT_NAME and STUDENT_ID here before re-rendering if you want your
personal details burned into the Opening and Closing frames.
"""

from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / "src"
ASSETS_DIR = SRC_DIR / "assets"
BUILD_DIR = PROJECT_ROOT / "build"
VIDEO_DIR = PROJECT_ROOT / "video"
DOCS_DIR = PROJECT_ROOT / "documents"

# Student / Course Metadata (shown in Opening & Closing frames)
STUDENT_NAME = "[YOUR NAME]"
STUDENT_ID = "[YOUR STUDENT ID]"
COURSE_NAME = "Linear Algebra and Calculus (M3)"
PROJECT_LABEL = "M3 Internal Assessment • Animation Video"
VIDEO_TITLE = "The Mystery of Limits: Getting Closer to a Point"
TOPIC_NAME = "Limits and Continuity"

# Video rendering settings
WIDTH = 1920
HEIGHT = 1080
FPS = 30
RENDER_WORKERS = 4  # Parallel Chrome instances for deterministic frame capture

# Audio & Narration settings
TTS_VOICE = "en-US-AndrewNeural"
TTS_RATE = "-3%"  # Slightly measured pace for clear educational delivery
MUSIC_VOLUME = 0.065  # Subtle ambient background pad (~ -24 dB under voice)
CHROME_EXECUTABLE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

