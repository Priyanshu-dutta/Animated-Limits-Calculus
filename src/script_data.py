"""Structured 6-scene beat definitions for narration, captions, and visual sync.

Each beat defines:
- id: unique identifier consumed by scenes.js
- scene: scene number (1..6)
- pause_after: silence (seconds) inserted after the spoken narration line
- narration: exact text synthesized by edge-tts and saved in narration_script.md
- caption: clean subtitle text shown on screen and exported to SRT
"""

SCENES = [
    {
        "scene": 1,
        "title": "Hook / The Mathematical Mystery",
        "beats": [
            {
                "id": "s1_intro",
                "pause_after": 0.9,
                "narration": (
                    "Welcome to The Mystery of Limits: Getting Closer to a Point, "
                    "an M3 calculus exploration."
                ),
                "caption": "The Mystery of Limits: Getting Closer to a Point",
            },
            {
                "id": "s1_hook_question",
                "pause_after": 0.9,
                "narration": (
                    "Think about this question: What happens when we approach a point "
                    "where a function doesn't even exist?"
                ),
                "caption": "What happens when we approach a point where the function doesn't even exist?",
            },
            {
                "id": "s1_show_eq",
                "pause_after": 0.7,
                "narration": (
                    "Consider the function f of x equals x squared minus four, "
                    "divided by x minus two."
                ),
                "caption": "Consider f(x) = (x² - 4) / (x - 2).",
            },
            {
                "id": "s1_val_15",
                "pause_after": 0.45,
                "narration": "Let's test inputs getting closer to two. At x equals one point five, the output is three point five.",
                "caption": "When x = 1.5, f(1.5) = 3.5",
            },
            {
                "id": "s1_val_19",
                "pause_after": 0.45,
                "narration": "At x equals one point nine, the function gives three point nine.",
                "caption": "When x = 1.9, f(1.9) = 3.9",
            },
            {
                "id": "s1_val_199",
                "pause_after": 0.55,
                "narration": "At x equals one point nine nine, we get three point nine nine.",
                "caption": "When x = 1.99, f(1.99) = 3.99",
            },
            {
                "id": "s1_val_2_undef",
                "pause_after": 0.8,
                "narration": (
                    "But at x equals two, the denominator becomes zero, "
                    "and the function is completely undefined."
                ),
                "caption": "At x = 2, the denominator is zero — f(2) is UNDEFINED!",
            },
            {
                "id": "s1_mystery",
                "pause_after": 1.1,
                "narration": (
                    "So here is the mystery: if the function is undefined at x equals two, "
                    "how can we still predict what value it is approaching?"
                ),
                "caption": "If the function is undefined at x = 2, how can we predict what value it is approaching?",
            },
        ],
    },
    {
        "scene": 2,
        "title": "Introducing the Concept of Limits",
        "beats": [
            {
                "id": "s2_notation",
                "pause_after": 0.7,
                "narration": (
                    "To answer this, mathematics gives us the idea of a limit, "
                    "written as the limit as x approaches a of f of x equals L."
                ),
                "caption": "Notation: lim (x → a) f(x) = L",
            },
            {
                "id": "s2_parts",
                "pause_after": 0.7,
                "narration": (
                    "Here, x is the input variable, a is the target value that x is approaching, "
                    "and L is the value that the function f of x approaches."
                ),
                "caption": "x = input, a = target value approached, L = value f(x) approaches",
            },
            {
                "id": "s2_numline_left",
                "pause_after": 0.6,
                "narration": (
                    "Picture a number line around two. From the left side, a point steps closer: "
                    "one point five, one point eight, one point nine, one point nine nine, "
                    "and one point nine nine nine."
                ),
                "caption": "Approaching 2 from the left: 1.5 → 1.8 → 1.9 → 1.99 → 1.999",
            },
            {
                "id": "s2_numline_right",
                "pause_after": 0.7,
                "narration": (
                    "From the right side, another point moves inward: "
                    "two point five, two point two, two point one, two point zero one, "
                    "and two point zero zero one."
                ),
                "caption": "Approaching 2 from the right: 2.5 → 2.2 → 2.1 → 2.01 → 2.001",
            },
            {
                "id": "s2_both_closer",
                "pause_after": 0.6,
                "narration": (
                    "Both points get arbitrarily close to two without ever needing to land exactly on two."
                ),
                "caption": "Both points move closer to 2 without needing to land on 2.",
            },
            {
                "id": "s2_core_idea",
                "pause_after": 1.1,
                "narration": (
                    "A limit does not necessarily ask what happens exactly at a point. "
                    "It asks what happens to the function as we get closer and closer to that point."
                ),
                "caption": "A limit asks what happens as we get closer and closer to a point.",
            },
        ],
    },
    {
        "scene": 3,
        "title": "Visual Intuition With a Graph",
        "beats": [
            {
                "id": "s3_axes_line",
                "pause_after": 0.7,
                "narration": (
                    "Let's see this visually on a coordinate plane. "
                    "Consider the straight line y equals x plus two."
                ),
                "caption": "Plotting the line y = x + 2 on the coordinate plane.",
            },
            {
                "id": "s3_highlight_24",
                "pause_after": 0.6,
                "narration": (
                    "On this simple line, when x equals two, y equals four, "
                    "giving the point two, four."
                ),
                "caption": "On y = x + 2, x = 2 corresponds to the point (2, 4).",
            },
            {
                "id": "s3_hole",
                "pause_after": 0.8,
                "narration": (
                    "Now look at our original function, f of x equals x squared minus four over x minus two. "
                    "It behaves exactly like the line y equals x plus two everywhere, except at x equals two, "
                    "where there is a missing point, shown as an open hole at two, four."
                ),
                "caption": "f(x) = (x² - 4)/(x - 2) matches y = x + 2 everywhere except a hole at (2, 4).",
            },
            {
                "id": "s3_left_move",
                "pause_after": 0.6,
                "narration": (
                    "Watch what happens as a point glides along the curve from the left toward x equals two: "
                    "the height y climbs steadily toward four."
                ),
                "caption": "Moving along the curve from the left → y approaches 4.",
            },
            {
                "id": "s3_right_move",
                "pause_after": 0.6,
                "narration": (
                    "Now watch from the right side: as x moves down toward two, "
                    "the height y again settles toward four."
                ),
                "caption": "Moving along the curve from the right → y approaches 4.",
            },
            {
                "id": "s3_both_agree",
                "pause_after": 1.1,
                "narration": (
                    "From the left, we head to four. From the right, we also head to four. "
                    "Because both sides approach the exact same value, the limit exists and equals four."
                ),
                "caption": "From the left → 4, from the right → 4. Both sides agree, so the limit is 4!",
            },
        ],
    },
    {
        "scene": 4,
        "title": "Step-by-Step Mathematical Solution",
        "beats": [
            {
                "id": "s4_prompt",
                "pause_after": 0.6,
                "narration": (
                    "Now let's prove this algebraically, step by step, "
                    "starting with the limit as x approaches two of x squared minus four over x minus two."
                ),
                "caption": "Evaluate: lim (x → 2) (x² - 4) / (x - 2)",
            },
            {
                "id": "s4_step1_sub",
                "pause_after": 0.7,
                "narration": (
                    "Step one: try direct substitution by plugging in x equals two. "
                    "We get two squared minus four over two minus two, which equals zero over zero."
                ),
                "caption": "Step 1: Direct substitution gives (2² - 4)/(2 - 2) = 0/0.",
            },
            {
                "id": "s4_step1_warn",
                "pause_after": 0.8,
                "narration": (
                    "Zero over zero is called an indeterminate form. "
                    "Be careful: this does not mean the limit is zero! "
                    "It is a signal that we need to simplify the expression."
                ),
                "caption": "0/0 is an Indeterminate Form — it means we need to simplify.",
            },
            {
                "id": "s4_step2_factor",
                "pause_after": 0.8,
                "narration": (
                    "Step two: factor the numerator. Notice x squared minus four is a difference of squares, "
                    "so it factors cleanly into x minus two times x plus two."
                ),
                "caption": "Step 2: Factor numerator: x² - 4 = (x - 2)(x + 2)",
            },
            {
                "id": "s4_step3_rewrite",
                "pause_after": 0.7,
                "narration": (
                    "Step three: rewrite the fraction with the factored numerator. "
                    "Look closely: the factor x minus two appears in both the top and the bottom."
                ),
                "caption": "Step 3: Rewrite as [(x - 2)(x + 2)] / (x - 2)",
            },
            {
                "id": "s4_step4_cancel",
                "pause_after": 0.8,
                "narration": (
                    "Step four: cancel the common factor x minus two. "
                    "Because a limit looks at x approaching two where x is not equal to two, "
                    "x minus two is never zero, so dividing it out is completely valid. "
                    "The expression simplifies to x plus two, for x not equal to two."
                ),
                "caption": "Step 4: Cancel (x - 2) → f(x) = x + 2, for x ≠ 2",
            },
            {
                "id": "s4_step5_eval",
                "pause_after": 1.1,
                "narration": (
                    "Step five: now evaluate the limit of the simplified expression. "
                    "The limit as x approaches two of x plus two equals two plus two, which gives four. "
                    "Everything matches our graph!"
                ),
                "caption": "Step 5: lim (x → 2) (x + 2) = 2 + 2 = 4",
            },
        ],
    },
    {
        "scene": 5,
        "title": "Left-Hand Limit, Right-Hand Limit & Interpretation",
        "beats": [
            {
                "id": "s5_graph_revisit",
                "pause_after": 0.6,
                "narration": (
                    "Let's connect our algebra back to the graph with the hole at two, four, "
                    "using one-sided limit notation."
                ),
                "caption": "Connecting algebra back to the graph using one-sided limits.",
            },
            {
                "id": "s5_lhl",
                "pause_after": 0.7,
                "narration": (
                    "As x approaches two from the left, written with a minus superscript, "
                    "the left-hand limit of f of x is four."
                ),
                "caption": "Left-hand limit: lim (x → 2⁻) f(x) = 4",
            },
            {
                "id": "s5_rhl",
                "pause_after": 0.7,
                "narration": (
                    "As x approaches two from the right, written with a plus superscript, "
                    "the right-hand limit of f of x is also four."
                ),
                "caption": "Right-hand limit: lim (x → 2⁺) f(x) = 4",
            },
            {
                "id": "s5_twosided",
                "pause_after": 0.8,
                "narration": (
                    "Since the left-hand limit and the right-hand limit are equal, "
                    "the two-sided limit exists and equals four."
                ),
                "caption": "Left-hand limit = Right-hand limit = 4 ⇒ lim (x → 2) f(x) = 4",
            },
            {
                "id": "s5_compare",
                "pause_after": 1.1,
                "narration": (
                    "Now notice the vital distinction: the limit at x equals two is four, "
                    "while the function value f of two is undefined. "
                    "The limit exists because both sides approach the same value, "
                    "even though the function has no defined value at exactly x equals two."
                ),
                "caption": "Limit at x = 2 is 4, even though f(2) is Undefined!",
            },
        ],
    },
    {
        "scene": 6,
        "title": "Summary, Conclusion & Credits",
        "beats": [
            {
                "id": "s6_take1",
                "pause_after": 0.55,
                "narration": (
                    "Let's recap three key takeaways. "
                    "First, a limit describes what value a function approaches near a point."
                ),
                "caption": "1. A limit describes what value a function approaches.",
            },
            {
                "id": "s6_take2",
                "pause_after": 0.55,
                "narration": (
                    "Second, left-hand and right-hand limits must agree for the two-sided limit to exist."
                ),
                "caption": "2. Left-hand and right-hand limits must agree for the limit to exist.",
            },
            {
                "id": "s6_take3",
                "pause_after": 0.75,
                "narration": (
                    "And third, a limit can exist even when the function itself is undefined at that point."
                ),
                "caption": "3. A limit can exist even when the function is undefined at that point.",
            },
            {
                "id": "s6_final_quote",
                "pause_after": 0.9,
                "narration": (
                    "So the limit as x approaches two of x squared minus four over x minus two is four. "
                    "In mathematics, sometimes what matters isn't where you are, but where you're heading."
                ),
                "caption": "In mathematics, sometimes what matters isn't where you are, but where you're heading.",
            },
            {
                "id": "s6_credits",
                "pause_after": 1.5,
                "narration": (
                    "Thank you for watching this M3 animation project on limits and continuity."
                ),
                "caption": "M3 Animation Project • Limits and Continuity • Credits & References",
            },
        ],
    },
]

