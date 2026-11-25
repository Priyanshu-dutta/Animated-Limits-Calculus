# 6-Scene Storyboard — *The Mystery of Limits: Getting Closer to a Point*

**Course:** Linear Algebra and Calculus (M3) — Internal Assessment  
**Topic:** Limits and Continuity (`Limits – What Happens When We Approach a Point?`)  
**Target Duration:** ~5 minutes (strictly < 7 minutes)  
**Resolution / Format:** 1920×1080 (16:9 Landscape), 30 fps, MP4  
**Learning Objective:** *By the end of this video, the viewer will be able to understand why a limit describes a function's approaching behavior near a point, compute $\lim_{x\to 2}\frac{x^2-4}{x-2}=4$ via factoring, and distinguish a limit from the actual function value at a removable discontinuity.*

---

## Visual Style & Color System
- **Canvas Background:** Deep dark navy / space black (`#050814` to `#0a1228`) with subtle coordinate grid glow.
- **Left Approach Accent:** Electric Cyan (`#22d3ee`)
- **Right Approach Accent:** Vivid Violet/Purple (`#a855f7`)
- **Primary Equations / Lines:** Crisp White (`#f8fafc`) & Sky Blue (`#38bdf8`)
- **Undefined / Warning Highlights:** Amber/Coral (`#f59e0b` / `#fb7185`)
- **Verified Result:** Emerald-Cyan glow (`#34d399` / `#22d3ee`)

---

## Scene-by-Scene Plan

| Scene | Approx. Time | Purpose | Visual Plan | Mathematical Content |
|---|---|---|---|---|
| **1. Hook / The Mathematical Mystery** | 0:00 – 0:45 | Spark curiosity with a paradox: approaching an undefined input | Opening title frame (title, concept, student name & ID) → glowing hook question on dark canvas → reveal $f(x)$ → sequential evaluation table ($1.5 \to 3.5$, $1.9 \to 3.9$, $1.99 \to 3.99$, $2 \to \text{Undefined}$) → mystery question. | $f(x)=\dfrac{x^2-4}{x-2}$; numerical table approaching $x=2$; division by zero at $x=2$. |
| **2. Introducing the Concept of Limits** | 0:45 – 1:30 | Define limit notation and geometric approach on 1D line | Display $\lim_{x\to a} f(x)=L$ with color-coded callouts for $x$, $a$, $L$. Transition to animated number line centered at $2$: cyan dot steps $1.5 \to 1.8 \to 1.9 \to 1.99 \to 1.999$; purple dot steps $2.5 \to 2.2 \to 2.1 \to 2.01 \to 2.001$. | $\lim_{x\to a} f(x)=L$; left and right sequences converging toward $a=2$ without landing on $2$. |
| **3. Visual Intuition With a Graph** | 1:30 – 2:25 | Build geometric intuition before algebraic manipulation | Draw 2D axes & grid → trace $y=x+2$ smoothly → highlight $(2,4)$ with dashed guides $x=2, y=4$ → replace filled point with a glowing **open circle (hole)** at $(2,4)$ → animate cyan dot from left & purple dot from right approaching $(2,4)$. | $y=x+2$ vs. $f(x)=\dfrac{x^2-4}{x-2}$; removable hole at $(2,4)$; both sides $\to 4$. |
| **4. Step-by-Step Mathematical Solution** | 2:25 – 3:45 | Prove why the limit equals $4$ algebraically | Reveal one step at a time: (1) direct substitution $\to 0/0$ indeterminate warning; (2) difference-of-squares factoring; (3) highlight common factor $(x-2)$; (4) animated slash cancellation with $x\neq 2$ condition; (5) substitute $x=2$ into $x+2$ to get boxed $4$. | $\frac{0}{0}$ indeterminate form; $x^2-4=(x-2)(x+2)$; $f(x)=x+2\ (x\neq 2)$; $\lim_{x\to 2}(x+2)=\boxed{4}$. |
| **5. Left-Hand, Right-Hand & Interpretation** | 3:45 – 4:35 | Connect algebra back to one-sided limits and hole distinction | Split layout: graph with hole at $(2,4)$ on left; one-sided limit equations on right. Animate left dot ($\lim_{x\to 2^-} f(x)=4$) then right dot ($\lim_{x\to 2^+} f(x)=4$), combine into two-sided limit $\boxed{4}$, then contrast cards: **Limit at $x=2$: 4** vs **Function value at $x=2$: Undefined**. | $\lim_{x\to 2^-}f(x)=\lim_{x\to 2^+}f(x)=4$; $\lim_{x\to 2}f(x)=4$ while $f(2)$ is undefined. |
| **6. Summary, Conclusion & Credits** | 4:35 – 5:10 | Reinforce 3 core takeaways and fulfill attribution requirements | Reveal 3 numbered takeaway cards sequentially → display boxed final equation beside mini-graph with hole at $(2,4)$ → closing quote → closing credits frame (name, ID, course, references, music credit, AI disclosure). | $\boxed{\lim_{x\to 2}\frac{x^2-4}{x-2}=4}$; 3 core principles of limits. |

