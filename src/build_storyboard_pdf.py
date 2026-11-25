"""Generate documents/storyboard.pdf from a clean print-styled HTML document using Chrome."""

from pathlib import Path
from playwright.sync_api import sync_playwright

from config import CHROME_EXECUTABLE, DOCS_DIR

STORYBOARD_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 16mm 15mm; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    line-height: 1.45;
    font-size: 11pt;
  }
  .header {
    border-bottom: 3px solid #0284c7;
    padding-bottom: 10px;
    margin-bottom: 14px;
  }
  .kicker {
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #0284c7;
    text-transform: uppercase;
  }
  h1 {
    font-size: 18pt;
    margin: 4px 0 6px 0;
    color: #0f172a;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 18px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 9.5pt;
    margin-bottom: 12px;
  }
  .objective {
    background: #eff6ff;
    border-left: 4px solid #2563eb;
    padding: 9px 12px;
    margin-bottom: 14px;
    font-size: 10pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.3pt;
    margin-top: 6px;
  }
  th {
    background: #0f172a;
    color: #ffffff;
    text-align: left;
    padding: 8px 9px;
    font-weight: 600;
  }
  td {
    border: 1px solid #cbd5e1;
    padding: 8px 9px;
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #f8fafc; }
  .scene-name { font-weight: 700; color: #0369a1; }
  .footer {
    margin-top: 14px;
    font-size: 8.8pt;
    color: #475569;
    border-top: 1px solid #cbd5e1;
    padding-top: 8px;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="kicker">Linear Algebra and Calculus (M3) • Internal Assessment</div>
    <h1>6-Scene Storyboard: The Mystery of Limits — Getting Closer to a Point</h1>
  </div>

  <div class="meta-grid">
    <div><strong>Topic:</strong> Limits and Continuity</div>
    <div><strong>Duration:</strong> ~5 min 27 sec (max 7 min)</div>
    <div><strong>Main Function:</strong> f(x) = (x² − 4) / (x − 2) as x → 2</div>
    <div><strong>Format:</strong> 1920×1080 (16:9), 30 fps MP4 + Voice-Over</div>
  </div>

  <div class="objective">
    <strong>Learning Objective:</strong> By the end of this video, the viewer will be able to understand why a limit describes a function's approaching behavior near a point, compute lim<sub>x→2</sub> (x² − 4)/(x − 2) = 4 algebraically by factoring, and distinguish a limit from the function value at a removable discontinuity.
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:17%;">Scene &amp; Time</th>
        <th style="width:20%;">Purpose</th>
        <th style="width:37%;">Visual &amp; Animation Plan</th>
        <th style="width:26%;">Narration &amp; Math Focus</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="scene-name">1. Hook / Context</span><br/>0:00 – 0:53</td>
        <td>Spark curiosity with an apparent paradox at an undefined point.</td>
        <td>Opening Title Frame (title, topic, student name &amp; ID) → glowing hook question on dark navy canvas → reveal f(x) → sequential value table (1.5 → 3.5, 1.9 → 3.9, 1.99 → 3.99, 2 → Undefined badge) → mystery prompt.</td>
        <td>Introduce f(x) = (x²−4)/(x−2). Show outputs approaching 4 while f(2) = 0/0 is undefined.</td>
      </tr>
      <tr>
        <td><span class="scene-name">2. Concept Introduction</span><br/>0:53 – 1:50</td>
        <td>Define limit notation and 1D left/right approach intuition.</td>
        <td>Display lim<sub>x→a</sub> f(x) = L with color-coded callouts (x cyan, a purple, L emerald). Animate a number line centered at 2: left dot steps 1.5 → 1.8 → 1.9 → 1.99 → 1.999; right dot steps 2.5 → 2.2 → 2.1 → 2.01 → 2.001.</td>
        <td>Explain x, a, and L. Emphasize that limits inspect behavior arbitrarily close to 2 without landing on 2.</td>
      </tr>
      <tr>
        <td><span class="scene-name">3. Visual Intuition</span><br/>1:50 – 2:44</td>
        <td>Build geometric intuition on the 2D coordinate plane first.</td>
        <td>Draw axes and grid → smoothly plot y = x + 2 → draw dashed guides at x = 2, y = 4 → convert (2, 4) into a glowing hollow open circle (hole) → animate cyan dot from left and purple dot from right approaching (2, 4).</td>
        <td>Show f(x) matches y = x + 2 everywhere except the removable hole at (2, 4). Both sides → 4.</td>
      </tr>
      <tr>
        <td><span class="scene-name">4. Worked Example</span><br/>2:44 – 4:03</td>
        <td>Prove the result step by step using algebra.</td>
        <td>Sequential card reveal (one step at a time): (1) Direct substitution → 0/0 warning; (2) Factor x²−4 = (x−2)(x+2); (3) Highlight common (x−2); (4) Animated diagonal slash cancellation for x ≠ 2; (5) Evaluate lim<sub>x→2</sub>(x+2) = 4.</td>
        <td>Explain why 0/0 is indeterminate, why canceling (x−2) is valid since x ≠ 2, and obtain boxed 4.</td>
      </tr>
      <tr>
        <td><span class="scene-name">5. Interpretation</span><br/>4:03 – 4:48</td>
        <td>Connect algebra back to one-sided limits and the graph hole.</td>
        <td>Split screen: graph with hole at (2, 4) alongside one-sided limit cards. Animate left dot (x → 2⁻) and right dot (x → 2⁺), then show side-by-side contrast cards: Limit at x = 2 is 4 vs. f(2) is Undefined.</td>
        <td>State lim<sub>x→2⁻</sub> f(x) = lim<sub>x→2⁺</sub> f(x) = 4, and contrast limit existence with f(2) undefined.</td>
      </tr>
      <tr>
        <td><span class="scene-name">6. Summary &amp; Credits</span><br/>4:48 – 5:27</td>
        <td>Reinforce core takeaways and display required credits.</td>
        <td>Reveal 3 numbered takeaway cards beside mini-graph and boxed final equation → closing quote banner → dedicated Closing Credits frame (student info, references, music credit, AI disclosure).</td>
        <td>Recap 3 takeaways, state final result lim<sub>x→2</sub> (x²−4)/(x−2) = 4, and present credits.</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <strong>Color Coding:</strong> Dark Navy/Black Canvas (#040712) • Left Approach Cyan (#22d3ee) • Right Approach Purple (#a855f7) • Hole/Warning Amber (#fbbf24) • Verified Limit Emerald (#34d399).
  </div>
</body>
</html>
"""


def build_storyboard_pdf() -> Path:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    html_tmp = DOCS_DIR / "_storyboard_print.html"
    pdf_out = DOCS_DIR / "storyboard.pdf"
    html_tmp.write_text(STORYBOARD_HTML, encoding="utf-8")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_EXECUTABLE, headless=True)
        page = browser.new_page()
        page.goto(html_tmp.as_uri(), wait_until="load")
        page.pdf(path=str(pdf_out), format="A4", print_background=True)
        browser.close()

    html_tmp.unlink(missing_ok=True)
    print(f"Generated storyboard PDF: {pdf_out}")
    return pdf_out


if __name__ == "__main__":
    build_storyboard_pdf()

