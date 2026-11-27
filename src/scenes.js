/* Deterministic 1920x1080 mathematical animation engine driven strictly by time `t`.
 * Reads timeline metadata injected into window.__TIMELINE__ (or fallback preview).
 */

(function () {
  const bgCanvas = document.getElementById("bg-canvas");
  const bgCtx = bgCanvas.getContext("2d");
  const fxCanvas = document.getElementById("fx-canvas");
  const fxCtx = fxCanvas.getContext("2d");

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
  const easeInOutCubic = (x) => {
    const c = clamp01(x);
    return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
  };
  const progress = (t, t0, dur = 0.65) => easeOutCubic((t - t0) / dur);

  function renderTex(id, latex, displayMode = true) {
    const el = document.getElementById(id);
    if (!el || typeof katex === "undefined") return;
    katex.render(latex, el, { displayMode, throwOnError: false, trust: true });
  }

  function initStaticMath() {
    renderTex("s1-main-eq", String.raw`f(x) = \frac{x^2 - 4}{x - 2}`);
    renderTex(
      "s2-lim-eq",
      String.raw`\lim_{\textcolor{#22d3ee}{x} \to \textcolor{#a855f7}{a}} f(\textcolor{#22d3ee}{x}) = \textcolor{#34d399}{L}`
    );
    renderTex("s2-mini-eq", String.raw`\lim_{x \to 2} f(x) = \; ?`);
    renderTex("s3-line-eq", String.raw`y = x + 2`);
    renderTex("s3-limit-eq", String.raw`\lim_{x \to 2}\frac{x^2 - 4}{x - 2} = 4`);

    renderTex("s4-header-eq", String.raw`\lim_{x \to 2}\frac{x^2 - 4}{x - 2}`);
    renderTex("s4-eq1", String.raw`\frac{2^2 - 4}{2 - 2} = \frac{0}{0}`);
    renderTex("s4-eq2", String.raw`x^2 - 4 = (x - 2)(x + 2)`);
    renderTex("s4-eq3", String.raw`\frac{\textcolor{#fbbf24}{(x - 2)}(x + 2)}{\textcolor{#fbbf24}{(x - 2)}}`);
    renderTex("s4-eq4", String.raw`= x + 2, \quad x \neq 2`);
    renderTex("s4-eq5", String.raw`\lim_{x \to 2}(x + 2) = 2 + 2 = \boxed{4}`);

    renderTex("s5-eq-lhl", String.raw`\lim_{x \to 2^{\textcolor{#22d3ee}{-}}} f(x) = 4`);
    renderTex("s5-eq-rhl", String.raw`\lim_{x \to 2^{\textcolor{#c084fc}{+}}} f(x) = 4`);
    renderTex("s5-eq-both", String.raw`\lim_{x \to 2^-} f(x) = \lim_{x \to 2^+} f(x) = 4`);
    renderTex("s5-eq-final", String.raw`\boxed{\lim_{x \to 2} f(x) = 4}`);

    renderTex("s6-final-box", String.raw`\boxed{\lim_{x \to 2}\frac{x^2 - 4}{x - 2} = 4}`);
  }

  let timeline = null;
  let beatMap = {};

  function setTimeline(tl) {
    timeline = tl;
    beatMap = {};
    for (const b of tl.beats) beatMap[b.id] = b;
    const n1 = document.getElementById("meta-name-s1");
    const i1 = document.getElementById("meta-id-s1");
    const n6 = document.getElementById("meta-name-s6");
    const i6 = document.getElementById("meta-id-s6");
    if (n1) n1.textContent = tl.student_name || "[YOUR NAME]";
    if (i1) i1.textContent = tl.student_id || "[YOUR STUDENT ID]";
    if (n6) n6.textContent = tl.student_name || "[YOUR NAME]";
    if (i6) i6.textContent = tl.student_id || "[YOUR STUDENT ID]";
  }

  function bt(id) {
    return beatMap[id] || { start: 0, speak_end: 1, end: 2 };
  }

  function setEl(id, opacity, translateY = 0, scale = 1) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.opacity = String(clamp01(opacity));
    el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  }

  // Background stars + subtle animated mathematical grid
  function drawBackground(t) {
    bgCtx.clearRect(0, 0, 1920, 1080);

    // Subtle moving coordinate grid
    bgCtx.save();
    bgCtx.strokeStyle = "rgba(56, 189, 248, 0.045)";
    bgCtx.lineWidth = 1;
    const step = 80;
    const ox = (t * 8) % step;
    const oy = (t * 5) % step;
    for (let x = ox; x < 1920; x += step) {
      bgCtx.beginPath();
      bgCtx.moveTo(x, 0);
      bgCtx.lineTo(x, 1080);
      bgCtx.stroke();
    }
    for (let y = oy; y < 1080; y += step) {
      bgCtx.beginPath();
      bgCtx.moveTo(0, y);
      bgCtx.lineTo(1920, y);
      bgCtx.stroke();
    }

    // Soft ambient particles
    for (let i = 0; i < 36; i++) {
      const seed = i * 137.508;
      const px = ((seed * 19.3 + t * (6 + (i % 5))) % 1920);
      const py = ((seed * 31.7 + Math.sin(t * 0.4 + i) * 35 + 1080) % 1080);
      const r = 1.3 + (i % 3) * 0.7;
      const a = 0.14 + 0.12 * Math.sin(t * 0.8 + i);
      bgCtx.fillStyle = i % 2 === 0 ? `rgba(34,211,238,${a})` : `rgba(168,85,247,${a})`;
      bgCtx.beginPath();
      bgCtx.arc(px, py, r, 0, Math.PI * 2);
      bgCtx.fill();
    }
    bgCtx.restore();
  }

  // Helper to draw Cartesian graph + y=x+2 + hole at (2,4) + moving dots
  function drawLimitGraph(ctx, cfg) {
    const {
      gx, gy, gw, gh,
      xMin, xMax, yMin, yMax,
      alpha = 1,
      lineProg = 1,
      guideProg = 0,
      holeProg = 0,
      leftDotX = null,
      rightDotX = null,
      showLabels = true,
      highlightHolePulse = 0
    } = cfg;

    if (alpha <= 0.01) return;
    const toPx = (x) => gx + ((x - xMin) / (xMax - xMin)) * gw;
    const toPy = (y) => gy + gh - ((y - yMin) / (yMax - yMin)) * gh;

    ctx.save();
    ctx.globalAlpha = clamp01(alpha);

    // Graph card frame
    ctx.fillStyle = "rgba(8, 15, 36, 0.84)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.30)";
    ctx.lineWidth = 2;
    roundRect(ctx, gx - 28, gy - 28, gw + 56, gh + 56, 22);
    ctx.fill();
    ctx.stroke();

    // Clip inner plot area
    ctx.save();
    roundRect(ctx, gx, gy, gw, gh, 12);
    ctx.clip();

    // Grid lines
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const px = toPx(x);
      ctx.strokeStyle = x === 0 ? "rgba(226, 232, 240, 0.6)" : "rgba(148, 163, 184, 0.14)";
      ctx.lineWidth = x === 0 ? 2.4 : 1;
      ctx.beginPath();
      ctx.moveTo(px, gy);
      ctx.lineTo(px, gy + gh);
      ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const py = toPy(y);
      ctx.strokeStyle = y === 0 ? "rgba(226, 232, 240, 0.6)" : "rgba(148, 163, 184, 0.14)";
      ctx.lineWidth = y === 0 ? 2.4 : 1;
      ctx.beginPath();
      ctx.moveTo(gx, py);
      ctx.lineTo(gx + gw, py);
      ctx.stroke();
    }

    // Dotted guides at x = 2 and y = 4
    const p2x = toPx(2);
    const p4y = toPy(4);
    if (guideProg > 0.01) {
      ctx.save();
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.65)";
      ctx.lineWidth = 2.5;
      // Vertical x = 2
      ctx.beginPath();
      ctx.moveTo(p2x, toPy(0));
      ctx.lineTo(p2x, lerp(toPy(0), p4y, guideProg));
      ctx.stroke();
      // Horizontal y = 4
      ctx.beginPath();
      ctx.moveTo(toPx(0), p4y);
      ctx.lineTo(lerp(toPx(0), p2x, guideProg), p4y);
      ctx.stroke();
      ctx.restore();
    }

    // Line y = x + 2
    if (lineProg > 0.01) {
      const xA = xMin;
      const xB = lerp(xMin, xMax, lineProg);
      const yA = xA + 2;
      const yB = xB + 2;

      const grad = ctx.createLinearGradient(toPx(xA), toPy(yA), toPx(xB), toPy(yB));
      grad.addColorStop(0, "#22d3ee");
      grad.addColorStop(0.55, "#38bdf8");
      grad.addColorStop(1, "#a855f7");

      ctx.save();
      ctx.shadowColor = "rgba(56, 189, 248, 0.6)";
      ctx.shadowBlur = 16;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(toPx(xA), toPy(yA));
      ctx.lineTo(toPx(xB), toPy(yB));
      ctx.stroke();
      ctx.restore();
    }

    // Point at (2, 4): solid initially if holeProg === 0 and guideProg > 0.7, then open circle hole!
    if (guideProg > 0.6 && holeProg < 0.05) {
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(p2x, p4y, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    if (holeProg > 0.01) {
      const r = 11 * holeProg;
      // Glow halo
      if (highlightHolePulse > 0) {
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.45 * highlightHolePulse})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(p2x, p4y, r + 9 + 5 * Math.sin(highlightHolePulse * Math.PI * 2), 0, Math.PI * 2);
        ctx.stroke();
      }
      // Clear interior with graph dark background so it's unmistakably a HOLE!
      ctx.fillStyle = "#080f24";
      ctx.beginPath();
      ctx.arc(p2x, p4y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.arc(p2x, p4y, r, 0, Math.PI * 2);
      ctx.stroke();

      if (showLabels && holeProg > 0.6) {
        ctx.fillStyle = "#fde68a";
        ctx.font = "700 22px -apple-system, sans-serif";
        ctx.fillText("Hole (2, 4) — Undefined", p2x + 20, p4y - 28);
      }
    }

    // Left moving dot
    if (leftDotX !== null) {
      const ly = leftDotX + 2;
      const lxPx = toPx(leftDotX);
      const lyPx = toPy(ly);

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lxPx, toPy(0));
      ctx.lineTo(lxPx, lyPx);
      ctx.lineTo(toPx(0), lyPx);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(lxPx, lyPx, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (showLabels) {
        ctx.fillStyle = "#67e8f9";
        ctx.font = "700 21px -apple-system, sans-serif";
        ctx.fillText(`(${leftDotX.toFixed(2)}, ${ly.toFixed(2)})`, lxPx - 145, lyPx - 18);
      }
    }

    // Right moving dot
    if (rightDotX !== null) {
      const ry = rightDotX + 2;
      const rxPx = toPx(rightDotX);
      const ryPx = toPy(ry);

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rxPx, toPy(0));
      ctx.lineTo(rxPx, ryPx);
      ctx.lineTo(toPx(0), ryPx);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#c084fc";
      ctx.beginPath();
      ctx.arc(rxPx, ryPx, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (showLabels) {
        ctx.fillStyle = "#e9d5ff";
        ctx.font = "700 21px -apple-system, sans-serif";
        ctx.fillText(`(${rightDotX.toFixed(2)}, ${ry.toFixed(2)})`, rxPx + 16, ryPx + 28);
      }
    }

    ctx.restore(); // end inner clip

    // Axis labels and tick numbers
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "700 24px -apple-system, sans-serif";
    ctx.fillText("x", gx + gw - 16, toPy(0) - 12);
    ctx.fillText("y", toPx(0) + 14, gy + 26);

    ctx.font = "600 18px -apple-system, sans-serif";
    ctx.fillStyle = "#94a3b8";
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue;
      const px = toPx(x);
      ctx.fillStyle = x === 2 ? "#fbbf24" : "#94a3b8";
      ctx.fillText(String(x), px - 6, toPy(0) + 24);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue;
      const py = toPy(y);
      ctx.fillStyle = y === 4 ? "#fbbf24" : "#94a3b8";
      ctx.fillText(String(y), toPx(0) - 24, py + 6);
    }

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawScene1FX(t, alpha) {
    // Draw a subtle decorative preview curve during the title card
    const bIntro = bt("s1_intro");
    if (t <= bIntro.end + 0.5) {
      const p = progress(t, 0.2, 3.0);
      fxCtx.save();
      fxCtx.globalAlpha = alpha * 0.28 * (1 - progress(t, bIntro.end - 0.5, 0.6));
      fxCtx.strokeStyle = "#22d3ee";
      fxCtx.lineWidth = 4;
      fxCtx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = (i / 120) * p;
        const x = 180 + u * 1560;
        const y = 780 - 220 * Math.sin(u * Math.PI * 1.15) - u * 180;
        if (i === 0) fxCtx.moveTo(x, y);
        else fxCtx.lineTo(x, y);
      }
      fxCtx.stroke();
      fxCtx.restore();
    }
  }

  function drawScene2FX(t, alpha) {
    const bNumL = bt("s2_numline_left");
    const bNumR = bt("s2_numline_right");
    const bBoth = bt("s2_both_closer");
    const showLine = progress(t, bNumL.start - 0.1, 0.7);
    if (showLine <= 0.01) return;

    fxCtx.save();
    fxCtx.globalAlpha = alpha * showLine;

    const cy = 540;
    const xLeft = 210;
    const xRight = 1710;
    const valToX = (v) => lerp(xLeft, xRight, (v - 1.2) / (2.8 - 1.2));

    // Main glowing axis
    fxCtx.strokeStyle = "#475569";
    fxCtx.lineWidth = 5;
    fxCtx.beginPath();
    fxCtx.moveTo(xLeft, cy);
    fxCtx.lineTo(xRight, cy);
    fxCtx.stroke();

    // Ticks
    const ticks = [1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5, 2.6, 2.8];
    for (const v of ticks) {
      const px = valToX(v);
      const isTwo = Math.abs(v - 2.0) < 1e-6;
      fxCtx.strokeStyle = isTwo ? "#fbbf24" : "#94a3b8";
      fxCtx.lineWidth = isTwo ? 4 : 2;
      fxCtx.beginPath();
      fxCtx.moveTo(px, cy - (isTwo ? 26 : 14));
      fxCtx.lineTo(px, cy + (isTwo ? 26 : 14));
      fxCtx.stroke();

      fxCtx.fillStyle = isTwo ? "#fbbf24" : "#cbd5e1";
      fxCtx.font = isTwo ? "800 32px -apple-system, sans-serif" : "600 22px -apple-system, sans-serif";
      const txt = isTwo ? "2" : v.toFixed(1);
      fxCtx.fillText(txt, px - (isTwo ? 10 : 16), cy + (isTwo ? 64 : 48));
    }

    // Target open ring at 2
    const p2 = valToX(2.0);
    fxCtx.fillStyle = "#060b1d";
    fxCtx.strokeStyle = "#fbbf24";
    fxCtx.lineWidth = 4;
    fxCtx.beginPath();
    fxCtx.arc(p2, cy, 13, 0, Math.PI * 2);
    fxCtx.fill();
    fxCtx.stroke();

    // Left sequence: 1.5 -> 1.8 -> 1.9 -> 1.99 -> 1.999
    const leftStops = [1.5, 1.8, 1.9, 1.99, 1.999];
    let leftX = 1.5;
    let leftStepLabel = "1.5";
    if (t >= bNumL.start) {
      const u = clamp01((t - bNumL.start) / (bNumL.speak_end - bNumL.start));
      const seg = u * (leftStops.length - 1);
      const idx = Math.min(leftStops.length - 2, Math.floor(seg));
      const f = easeInOutCubic(seg - idx);
      leftX = lerp(leftStops[idx], leftStops[idx + 1], f);
      leftStepLabel = leftStops[Math.round(seg)].toString();
      if (t >= bBoth.start) {
        const u2 = easeInOutCubic((t - bBoth.start) / 2.2);
        leftX = lerp(1.98, 1.982, u2);
        leftStepLabel = "1.999...";
      }
      const lx = valToX(leftX);
      // Arrow from left
      fxCtx.strokeStyle = "#22d3ee";
      fxCtx.lineWidth = 4;
      fxCtx.beginPath();
      fxCtx.moveTo(valToX(1.4), cy - 72);
      fxCtx.lineTo(Math.min(lx - 14, p2 - 22), cy - 72);
      fxCtx.stroke();

      fxCtx.save();
      fxCtx.shadowColor = "#22d3ee";
      fxCtx.shadowBlur = 20;
      fxCtx.fillStyle = "#22d3ee";
      fxCtx.beginPath();
      fxCtx.arc(lx, cy, 13, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.restore();

      // Floating badge kept strictly left of target 2
      const lBoxW = 178;
      const lBoxX = Math.min(lx - lBoxW / 2, p2 - lBoxW - 18);
      fxCtx.fillStyle = "rgba(8, 51, 68, 0.92)";
      fxCtx.strokeStyle = "#22d3ee";
      fxCtx.lineWidth = 2;
      roundRect(fxCtx, lBoxX, cy - 142, lBoxW, 50, 12);
      fxCtx.fill();
      fxCtx.stroke();
      fxCtx.fillStyle = "#67e8f9";
      fxCtx.font = "800 24px -apple-system, sans-serif";
      fxCtx.fillText(`x = ${leftStepLabel}`, lBoxX + 16, cy - 109);
    }

    // Right sequence: 2.5 -> 2.2 -> 2.1 -> 2.01 -> 2.001
    const rightStops = [2.5, 2.2, 2.1, 2.01, 2.001];
    let rightX = 2.5;
    let rightStepLabel = "2.5";
    if (t >= bNumR.start) {
      const u = clamp01((t - bNumR.start) / (bNumR.speak_end - bNumR.start));
      const seg = u * (rightStops.length - 1);
      const idx = Math.min(rightStops.length - 2, Math.floor(seg));
      const f = easeInOutCubic(seg - idx);
      rightX = lerp(rightStops[idx], rightStops[idx + 1], f);
      rightStepLabel = rightStops[Math.round(seg)].toString();
      if (t >= bBoth.start) {
        const u2 = easeInOutCubic((t - bBoth.start) / 2.2);
        rightX = lerp(2.02, 2.018, u2);
        rightStepLabel = "2.001...";
      }
      const rx = valToX(rightX);
      fxCtx.strokeStyle = "#a855f7";
      fxCtx.lineWidth = 4;
      fxCtx.beginPath();
      fxCtx.moveTo(valToX(2.6), cy - 72);
      fxCtx.lineTo(Math.max(rx + 14, p2 + 22), cy - 72);
      fxCtx.stroke();

      fxCtx.save();
      fxCtx.shadowColor = "#a855f7";
      fxCtx.shadowBlur = 20;
      fxCtx.fillStyle = "#c084fc";
      fxCtx.beginPath();
      fxCtx.arc(rx, cy, 13, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.restore();

      // Floating badge kept strictly right of target 2
      const rBoxW = 186;
      const rBoxX = Math.max(rx - rBoxW / 2, p2 + 18);
      fxCtx.fillStyle = "rgba(59, 7, 100, 0.92)";
      fxCtx.strokeStyle = "#a855f7";
      fxCtx.lineWidth = 2;
      roundRect(fxCtx, rBoxX, cy - 142, rBoxW, 50, 12);
      fxCtx.fill();
      fxCtx.stroke();
      fxCtx.fillStyle = "#e9d5ff";
      fxCtx.font = "800 24px -apple-system, sans-serif";
      fxCtx.fillText(`x = ${rightStepLabel}`, rBoxX + 16, cy - 109);
    }

    fxCtx.restore();
  }

  function drawScene3FX(t, alpha) {
    const bLine = bt("s3_axes_line");
    const b24 = bt("s3_highlight_24");
    const bHole = bt("s3_hole");
    const bL = bt("s3_left_move");
    const bR = bt("s3_right_move");
    const bAgree = bt("s3_both_agree");

    const lineP = progress(t, bLine.start + 0.5, 2.5);
    const guideP = progress(t, b24.start + 0.3, 1.5);
    const holeP = progress(t, bHole.start + 1.5, 1.1);

    let leftDotX = null;
    if (t >= bL.start) {
      const u = easeInOutCubic((t - bL.start) / (bL.speak_end - bL.start));
      leftDotX = lerp(0.2, 1.92, u);
      if (t >= bAgree.start) leftDotX = 1.94 + 0.03 * Math.sin((t - bAgree.start) * 3);
    }

    let rightDotX = null;
    if (t >= bR.start) {
      const u = easeInOutCubic((t - bR.start) / (bR.speak_end - bR.start));
      rightDotX = lerp(3.7, 2.08, u);
      if (t >= bAgree.start) rightDotX = 2.06 - 0.03 * Math.sin((t - bAgree.start) * 3);
    }

    const pulse = t >= bHole.start ? 0.5 + 0.5 * Math.sin((t - bHole.start) * 4) : 0;

    drawLimitGraph(fxCtx, {
      gx: 115, gy: 135, gw: 980, gh: 750,
      xMin: -1.0, xMax: 4.5, yMin: -0.5, yMax: 6.5,
      alpha,
      lineProg: lineP,
      guideProg: guideP,
      holeProg: holeP,
      leftDotX,
      rightDotX,
      showLabels: true,
      highlightHolePulse: pulse
    });
  }

  function drawScene4FX(t, alpha) {
    // Draw animated slash marks cancelling (x-2) in Step 4 directly over #s4-eq3 or #s4-eq4
    const b4 = bt("s4_step4_cancel");
    const slashP = progress(t, b4.start + 0.4, 1.1);
    if (slashP <= 0.01) return;

    const eq3 = document.getElementById("s4-eq3");
    if (!eq3) return;
    const rect = eq3.getBoundingClientRect();
    // Draw glowing diagonal cancellation slashes on the left numerator (x-2) and denominator (x-2)
    const cxNum = rect.left + rect.width * 0.405;
    const cyNum = rect.top + rect.height * 0.28;
    const cxDen = rect.left + rect.width * 0.49;
    const cyDen = rect.top + rect.height * 0.72;

    fxCtx.save();
    fxCtx.globalAlpha = alpha;
    fxCtx.strokeStyle = "#fb7185";
    fxCtx.shadowColor = "#fb7185";
    fxCtx.shadowBlur = 14;
    fxCtx.lineWidth = 5;
    fxCtx.lineCap = "round";

    // Numerator slash
    fxCtx.beginPath();
    fxCtx.moveTo(cxNum - 55, cyNum + 20);
    fxCtx.lineTo(lerp(cxNum - 55, cxNum + 55, slashP), lerp(cyNum + 20, cyNum - 20, slashP));
    fxCtx.stroke();

    // Denominator slash
    fxCtx.beginPath();
    fxCtx.moveTo(cxDen - 55, cyDen + 20);
    fxCtx.lineTo(lerp(cxDen - 55, cxDen + 55, slashP), lerp(cyDen + 20, cyDen - 20, slashP));
    fxCtx.stroke();
    fxCtx.restore();
  }

  function drawScene5FX(t, alpha) {
    const bL = bt("s5_lhl");
    const bR = bt("s5_rhl");
    const bBoth = bt("s5_twosided");

    let leftDotX = null;
    if (t >= bL.start) {
      const u = easeInOutCubic((t - bL.start) / (bL.speak_end - bL.start));
      leftDotX = lerp(0.3, 1.93, u);
    }
    let rightDotX = null;
    if (t >= bR.start) {
      const u = easeInOutCubic((t - bR.start) / (bR.speak_end - bR.start));
      rightDotX = lerp(3.6, 2.07, u);
    }
    const pulse = t >= bBoth.start ? 0.5 + 0.5 * Math.sin(t * 4) : 0.3;

    drawLimitGraph(fxCtx, {
      gx: 110, gy: 135, gw: 960, gh: 740,
      xMin: -1.0, xMax: 4.5, yMin: -0.5, yMax: 6.5,
      alpha,
      lineProg: 1,
      guideProg: 1,
      holeProg: 1,
      leftDotX,
      rightDotX,
      showLabels: true,
      highlightHolePulse: pulse
    });
  }

  function drawScene6FX(t, alpha) {
    const bCred = bt("s6_credits");
    const fadeOut = 1 - progress(t, bCred.start - 0.3, 0.7);
    if (fadeOut <= 0.01) return;

    drawLimitGraph(fxCtx, {
      gx: 1085, gy: 375, gw: 710, gh: 390,
      xMin: -0.5, xMax: 4.2, yMin: 0.0, yMax: 6.0,
      alpha: alpha * fadeOut,
      lineProg: 1,
      guideProg: 1,
      holeProg: 1,
      leftDotX: 1.93,
      rightDotX: 2.07,
      showLabels: false,
      highlightHolePulse: 0.5 + 0.5 * Math.sin(t * 3.5)
    });
  }

  function updateSubtitle(t) {
    const wrap = document.getElementById("subtitle-wrap");
    const pill = document.getElementById("subtitle-pill");
    if (!timeline || !pill) return;
    if (timeline.show_subtitles === false) {
      if (wrap) wrap.style.display = "none";
      pill.style.opacity = "0";
      return;
    }
    if (wrap) wrap.style.display = "flex";
    let active = null;
    for (const b of timeline.beats) {
      if (t >= b.start && t <= b.speak_end + 0.2) {
        active = b;
        break;
      }
    }
    if (active) {
      pill.textContent = active.caption;
      pill.style.opacity = "1";
    } else {
      pill.style.opacity = "0";
    }
  }

  function renderAtTime(t) {
    if (!timeline) return;

    drawBackground(t);
    fxCtx.clearRect(0, 0, 1920, 1080);

    // Progress bar
    const bar = document.getElementById("top-progress-bar");
    if (bar) bar.style.width = `${clamp01(t / timeline.total_duration) * 100}%`;

    // Determine active scene
    let activeScene = 1;
    for (let s = 1; s <= 6; s++) {
      const info = timeline.scenes[String(s)];
      if (t >= info.start && t <= info.end) {
        activeScene = s;
        break;
      }
      if (t > info.end) activeScene = s;
    }

    const sInfo = timeline.scenes[String(activeScene)];
    const label = document.getElementById("scene-label");
    if (label && sInfo) label.textContent = `SCENE ${activeScene} • ${sInfo.title}`;

    // Scene container opacities with smooth 0.5s transitions
    const sceneOpacities = {};
    for (let s = 1; s <= 6; s++) {
      const info = timeline.scenes[String(s)];
      const fadeIn = s === 1 ? 1 : progress(t, info.start, 0.55);
      const fadeOut = s === 6 ? 1 : 1 - progress(t, info.end - 0.45, 0.45);
      const op = t >= info.start - 0.1 && t <= info.end + 0.1 ? Math.min(fadeIn, fadeOut) : 0;
      sceneOpacities[s] = op;
      const el = document.getElementById(`scene-${s}`);
      if (el) el.style.opacity = String(clamp01(op));
    }

    // ---- SCENE 1 ----
    if (sceneOpacities[1] > 0.01) {
      const bIntro = bt("s1_intro");
      const bHook = bt("s1_hook_question");
      const bEq = bt("s1_show_eq");
      const b15 = bt("s1_val_15");
      const b19 = bt("s1_val_19");
      const b199 = bt("s1_val_199");
      const b2 = bt("s1_val_2_undef");
      const bMys = bt("s1_mystery");

      const titleOp = progress(t, 0.15, 0.9) * (1 - progress(t, bIntro.end - 0.4, 0.5));
      setEl("s1-title-card", titleOp, (1 - progress(t, 0.15, 0.9)) * 30);

      const hookOp = progress(t, bHook.start, 0.7) * (1 - progress(t, bEq.start - 0.35, 0.45));
      setEl("s1-hook-q", hookOp, (1 - progress(t, bHook.start, 0.7)) * 28);

      const panelIn = progress(t, bEq.start, 0.7);
      setEl("s1-eq-panel", panelIn, (1 - panelIn) * 28);
      setEl("s1-table-panel", progress(t, b15.start - 0.3, 0.7), (1 - progress(t, b15.start - 0.3, 0.7)) * 28);

      setEl("s1-row-15", progress(t, b15.start + 0.3, 0.55));
      setEl("s1-row-19", progress(t, b19.start + 0.2, 0.55));
      setEl("s1-row-199", progress(t, b199.start + 0.2, 0.55));
      setEl("s1-row-2", progress(t, b2.start + 0.3, 0.55));

      const probe = document.getElementById("s1-probe-readout");
      if (probe) {
        if (t >= b2.start) {
          probe.innerHTML = 'At <span style="color:#fbbf24;font-weight:800;">x = 2</span>: denominator = <span style="color:#fb7185;font-weight:800;">0</span> → Undefined!';
        } else if (t >= b199.start) {
          probe.innerHTML = 'Testing <span style="color:#22d3ee;font-weight:800;">x = 1.99</span> → f(1.99) = <span style="color:#38bdf8;font-weight:800;">3.99</span>';
        } else if (t >= b19.start) {
          probe.innerHTML = 'Testing <span style="color:#22d3ee;font-weight:800;">x = 1.9</span> → f(1.9) = <span style="color:#38bdf8;font-weight:800;">3.9</span>';
        } else if (t >= b15.start) {
          probe.innerHTML = 'Testing <span style="color:#22d3ee;font-weight:800;">x = 1.5</span> → f(1.5) = <span style="color:#38bdf8;font-weight:800;">3.5</span>';
        } else {
          probe.innerHTML = 'What happens as <span style="color:#22d3ee;font-weight:700;">x</span> gets closer to <span style="color:#fbbf24;font-weight:700;">2</span>?';
        }
      }

      const mysOp = progress(t, bMys.start, 0.75);
      setEl("s1-mystery-banner", mysOp, (1 - mysOp) * 26);

      drawScene1FX(t, sceneOpacities[1]);
    }

    // ---- SCENE 2 ----
    if (sceneOpacities[2] > 0.01) {
      const bNot = bt("s2_notation");
      const bParts = bt("s2_parts");
      const bNumL = bt("s2_numline_left");
      const bCore = bt("s2_core_idea");

      const firstHalfOut = 1 - progress(t, bNumL.start - 0.5, 0.55);
      setEl("s2-notation-box", progress(t, bNot.start, 0.7) * firstHalfOut, (1 - progress(t, bNot.start, 0.7)) * 26);
      setEl("s2-call-x", progress(t, bParts.start + 0.2, 0.55) * firstHalfOut, (1 - progress(t, bParts.start + 0.2, 0.55)) * 22);
      setEl("s2-call-a", progress(t, bParts.start + 2.2, 0.55) * firstHalfOut, (1 - progress(t, bParts.start + 2.2, 0.55)) * 22);
      setEl("s2-call-L", progress(t, bParts.start + 4.4, 0.55) * firstHalfOut, (1 - progress(t, bParts.start + 4.4, 0.55)) * 22);

      const numIn = progress(t, bNumL.start - 0.2, 0.6);
      setEl("s2-numline-header", numIn, (1 - numIn) * 20);

      const coreOp = progress(t, bCore.start, 0.7);
      setEl("s2-core-banner", coreOp, (1 - coreOp) * 24);

      drawScene2FX(t, sceneOpacities[2]);
    }

    // ---- SCENE 3 ----
    if (sceneOpacities[3] > 0.01) {
      const bAxes = bt("s3_axes_line");
      const bHole = bt("s3_hole");
      const bL = bt("s3_left_move");
      const bR = bt("s3_right_move");
      const bAgree = bt("s3_both_agree");

      setEl("s3-card-line", progress(t, bAxes.start + 0.6, 0.7));
      const holeP = progress(t, bHole.start + 0.6, 0.6);
      setEl("s3-hole-note", holeP);

      const lbl = document.getElementById("s3-func-label");
      const eqEl = document.getElementById("s3-line-eq");
      if (lbl && eqEl) {
        if (t >= bHole.start + 0.4) {
          if (eqEl.dataset.mode !== "fx") {
            eqEl.dataset.mode = "fx";
            lbl.textContent = "Original Function With Hole";
            renderTex("s3-line-eq", String.raw`f(x) = \frac{x^2 - 4}{x - 2}`);
          }
        } else if (eqEl.dataset.mode !== "line") {
          eqEl.dataset.mode = "line";
          lbl.textContent = "Linear Reference Curve";
          renderTex("s3-line-eq", String.raw`y = x + 2`);
        }
      }

      setEl("s3-card-approaches", progress(t, bL.start, 0.6));
      setEl("s3-left-row", progress(t, bL.start + 0.4, 0.6));
      setEl("s3-right-row", progress(t, bR.start + 0.4, 0.6));
      const agP = progress(t, bAgree.start + 0.4, 0.7);
      setEl("s3-card-agree", agP, (1 - agP) * 20);

      drawScene3FX(t, sceneOpacities[3]);
    }

    // ---- SCENE 4 ----
    if (sceneOpacities[4] > 0.01) {
      const bP = bt("s4_prompt");
      const b1 = bt("s4_step1_sub");
      const b1w = bt("s4_step1_warn");
      const b2 = bt("s4_step2_factor");
      const b3 = bt("s4_step3_rewrite");
      const b4 = bt("s4_step4_cancel");
      const b5 = bt("s4_step5_eval");

      setEl("s4-header-eq", progress(t, bP.start, 0.65), (1 - progress(t, bP.start, 0.65)) * 20);
      setEl("s4-step1", progress(t, b1.start, 0.65), (1 - progress(t, b1.start, 0.65)) * 24);
      setEl("s4-warn1", progress(t, b1w.start + 0.2, 0.65));
      setEl("s4-step2", progress(t, b2.start, 0.65), (1 - progress(t, b2.start, 0.65)) * 24);
      setEl("s4-step3", progress(t, b3.start, 0.65), (1 - progress(t, b3.start, 0.65)) * 24);
      setEl("s4-step4", progress(t, b4.start + 1.5, 0.65), (1 - progress(t, b4.start + 1.5, 0.65)) * 24);
      setEl("s4-step5-box", progress(t, b5.start, 0.75), (1 - progress(t, b5.start, 0.75)) * 24);

      drawScene4FX(t, sceneOpacities[4]);
    }

    // ---- SCENE 5 ----
    if (sceneOpacities[5] > 0.01) {
      const bL = bt("s5_lhl");
      const bR = bt("s5_rhl");
      const bBoth = bt("s5_twosided");
      const bCmp = bt("s5_compare");

      setEl("s5-card-lhl", progress(t, bL.start, 0.65), (1 - progress(t, bL.start, 0.65)) * 20);
      setEl("s5-card-rhl", progress(t, bR.start, 0.65), (1 - progress(t, bR.start, 0.65)) * 20);
      setEl("s5-card-both", progress(t, bBoth.start, 0.65), (1 - progress(t, bBoth.start, 0.65)) * 20);
      setEl("s5-compare-grid", progress(t, bCmp.start, 0.75), (1 - progress(t, bCmp.start, 0.75)) * 24);

      drawScene5FX(t, sceneOpacities[5]);
    }

    // ---- SCENE 6 ----
    if (sceneOpacities[6] > 0.01) {
      const b1 = bt("s6_take1");
      const b2 = bt("s6_take2");
      const b3 = bt("s6_take3");
      const bQ = bt("s6_final_quote");
      const bCred = bt("s6_credits");

      const recapFade = 1 - progress(t, bCred.start - 0.3, 0.7);
      setEl("s6-t1", progress(t, b1.start, 0.65) * recapFade, (1 - progress(t, b1.start, 0.65)) * 20);
      setEl("s6-t2", progress(t, b2.start, 0.65) * recapFade, (1 - progress(t, b2.start, 0.65)) * 20);
      setEl("s6-t3", progress(t, b3.start, 0.65) * recapFade, (1 - progress(t, b3.start, 0.65)) * 20);
      setEl("s6-right-eq", progress(t, b1.start, 0.7) * recapFade);
      setEl("s6-quote-banner", progress(t, bQ.start + 1.5, 0.75) * recapFade, (1 - progress(t, bQ.start + 1.5, 0.75)) * 20);

      const credOp = progress(t, bCred.start, 0.8);
      setEl("s6-credits-panel", credOp, (1 - credOp) * 28);

      drawScene6FX(t, sceneOpacities[6]);
    }

    updateSubtitle(t);
  }

  initStaticMath();
  window.setTimeline = setTimeline;
  window.renderAtTime = renderAtTime;
})();
