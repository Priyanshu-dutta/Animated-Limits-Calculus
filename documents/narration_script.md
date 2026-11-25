# Voice-Over Narration Script

**Video Title:** The Mystery of Limits: Getting Closer to a Point  
**Course:** Linear Algebra and Calculus (M3) — Internal Assessment  
**Topic:** Limits and Continuity  
**Target Duration:** ~5 minutes (strictly under 7 minutes)  
**Main Example:** $f(x) = \dfrac{x^2 - 4}{x - 2}$ as $x \to 2$

---

## Recording & Pacing Tips (For Manual Recording)
- Speak calmly, clearly, and conversationally—like explaining the idea to a friend sitting next to you.
- Pause briefly (~0.5–1.0s) after each bullet/beat so the viewer can absorb the equations and graph motion.
- Emphasize key contrast words: *"undefined"*, *"approaching"*, *"indeterminate form"*, *"not equal to two"*.

---

## Scene 1 — Hook / The Mathematical Mystery (0:00 – 0:45)

1. **[Opening Title Card]**  
   "Welcome to *The Mystery of Limits: Getting Closer to a Point*, an M3 calculus exploration."
2. **[Hook Question]**  
   "Think about this question: What happens when we approach a point where a function doesn't even exist?"
3. **[Equation Reveal: $f(x)=\frac{x^2-4}{x-2}$]**  
   "Consider the function $f$ of $x$ equals $x$ squared minus four, divided by $x$ minus two."
4. **[Probe $x = 1.5$]**  
   "Let's test inputs getting closer to two. At $x$ equals one point five, the output is three point five."
5. **[Probe $x = 1.9$]**  
   "At $x$ equals one point nine, the function gives three point nine."
6. **[Probe $x = 1.99$]**  
   "At $x$ equals one point nine nine, we get three point nine nine."
7. **[Probe $x = 2 \to$ Undefined]**  
   "But at $x$ equals two, the denominator becomes zero, and the function is completely undefined."
8. **[Mystery Question]**  
   "So here is the mystery: if the function is undefined at $x$ equals two, how can we still predict what value it is approaching?"

---

## Scene 2 — Introducing the Concept of Limits (0:45 – 1:30)

1. **[Notation: $\lim_{x\to a} f(x) = L$]**  
   "To answer this, mathematics gives us the idea of a limit, written as the limit as $x$ approaches $a$ of $f$ of $x$ equals $L$."
2. **[Callouts for $x, a, L$]**  
   "Here, $x$ is the input variable, $a$ is the target value that $x$ is approaching, and $L$ is the value that the function $f$ of $x$ approaches."
3. **[Number Line — Left Approach]**  
   "Picture a number line around two. From the left side, a point steps closer: one point five, one point eight, one point nine, one point nine nine, and one point nine nine nine."
4. **[Number Line — Right Approach]**  
   "From the right side, another point moves inward: two point five, two point two, two point one, two point zero one, and two point zero zero one."
5. **[Both Sides Closing In]**  
   "Both points get arbitrarily close to two without ever needing to land exactly on two."
6. **[Core Principle]**  
   "A limit does not necessarily ask what happens exactly at a point. It asks what happens to the function as we get closer and closer to that point."

---

## Scene 3 — Visual Intuition With a Graph (1:30 – 2:25)

1. **[Plot Line $y = x + 2$]**  
   "Let's see this visually on a coordinate plane. Consider the straight line $y$ equals $x$ plus two."
2. **[Highlight $(2, 4)$]**  
   "On this simple line, when $x$ equals two, $y$ equals four, giving the point two, four."
3. **[Open Hole at $(2, 4)$]**  
   "Now look at our original function, $f$ of $x$ equals $x$ squared minus four over $x$ minus two. It behaves exactly like the line $y$ equals $x$ plus two everywhere, except at $x$ equals two, where there is a missing point, shown as an open hole at two, four."
4. **[Curve Motion — Left]**  
   "Watch what happens as a point glides along the curve from the left toward $x$ equals two: the height $y$ climbs steadily toward four."
5. **[Curve Motion — Right]**  
   "Now watch from the right side: as $x$ moves down toward two, the height $y$ again settles toward four."
6. **[Agreement]**  
   "From the left, we head to four. From the right, we also head to four. Because both sides approach the exact same value, the limit exists and equals four."

---

## Scene 4 — Step-by-Step Mathematical Solution (2:25 – 3:45)

1. **[Original Limit]**  
   "Now let's prove this algebraically, step by step, starting with the limit as $x$ approaches two of $x$ squared minus four over $x$ minus two."
2. **[Step 1: Direct Substitution]**  
   "Step one: try direct substitution by plugging in $x$ equals two. We get two squared minus four over two minus two, which equals zero over zero."
3. **[Indeterminate Form Warning]**  
   "Zero over zero is called an indeterminate form. Be careful: this does not mean the limit is zero! It is a signal that we need to simplify the expression."
4. **[Step 2: Factor Numerator]**  
   "Step two: factor the numerator. Notice $x$ squared minus four is a difference of squares, so it factors cleanly into $x$ minus two times $x$ plus two."
5. **[Step 3: Rewrite Fraction]**  
   "Step three: rewrite the fraction with the factored numerator. Look closely: the factor $x$ minus two appears in both the top and the bottom."
6. **[Step 4: Cancel Common Factor ($x \neq 2$)]**  
   "Step four: cancel the common factor $x$ minus two. Because a limit looks at $x$ approaching two where $x$ is not equal to two, $x$ minus two is never zero, so dividing it out is completely valid. The expression simplifies to $x$ plus two, for $x$ not equal to two."
7. **[Step 5: Evaluate Simplified Limit]**  
   "Step five: now evaluate the limit of the simplified expression. The limit as $x$ approaches two of $x$ plus two equals two plus two, which gives four. Everything matches our graph!"

---

## Scene 5 — Left-Hand Limit, Right-Hand Limit & Interpretation (3:45 – 4:35)

1. **[Revisit Graph with Hole]**  
   "Let's connect our algebra back to the graph with the hole at two, four, using one-sided limit notation."
2. **[Left-Hand Limit]**  
   "As $x$ approaches two from the left, written with a minus superscript, the left-hand limit of $f$ of $x$ is four."
3. **[Right-Hand Limit]**  
   "As $x$ approaches two from the right, written with a plus superscript, the right-hand limit of $f$ of $x$ is also four."
4. **[Two-Sided Existence]**  
   "Since the left-hand limit and the right-hand limit are equal, the two-sided limit exists and equals four."
5. **[Limit vs Function Value Comparison]**  
   "Now notice the vital distinction: the limit at $x$ equals two is four, while the function value $f$ of two is undefined. The limit exists because both sides approach the same value, even though the function has no defined value at exactly $x$ equals two."

---

## Scene 6 — Summary, Conclusion & Credits (4:35 – 5:10)

1. **[Takeaway 1]**  
   "Let's recap three key takeaways. First, a limit describes what value a function approaches near a point."
2. **[Takeaway 2]**  
   "Second, left-hand and right-hand limits must agree for the two-sided limit to exist."
3. **[Takeaway 3]**  
   "And third, a limit can exist even when the function itself is undefined at that point."
4. **[Final Equation & Quote]**  
   "So the limit as $x$ approaches two of $x$ squared minus four over $x$ minus two is four. In mathematics, sometimes what matters isn't where you are, but where you're heading."
5. **[Credits]**  
   "Thank you for watching this M3 animation project on limits and continuity."

