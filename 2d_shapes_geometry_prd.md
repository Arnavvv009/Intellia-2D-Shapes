# Product Requirements Document (PRD) — ADVANCED SPECIFICATION

## 2D Shapes: Square, Rectangle, Triangle, Circle — Grade 2 Math
### Intellia SG | Singapore Primary Mathematics Curriculum (MOE)
### Reference Parity Target: `intellia-substraction.vercel.app` (pixel/behavior-level clone of structure, 100% original content)

---

## 0. How to Read This Document

This PRD is written at **build-spec fidelity**, not concept fidelity. Every screen in the reference app (`intellia-substraction.vercel.app`) was captured and reverse-engineered region-by-region: layout grid, spacing, color values, copy tone, icon placement, button states, and motion. Every section below maps 1:1 to a captured reference screen, with an explicit "REFERENCE BEHAVIOR" callout (what the reference does) followed by "THIS MODULE" (what we build — same mechanism, entirely new content). Nothing in this document should require the engineering team to guess at visual intent; ambiguity is treated as a defect in the PRD, not a gap to fill on instinct.

This module is **Lesson 9.1** in the Grade 2 Math course — the opening lesson of **Section 9: Geometry**, confirmed live at `intelliasg.com/courses/grade-2-math/`.

---

## 1. Executive Summary

Intellia SG ships a proven 5-phase gamified lesson engine, already live in production as the **Subtraction with Regrouping** module (Grade 2, Lesson 3.2) at `intellia-substraction.vercel.app`. That module is the **design system source of truth**. This PRD specifies a **new lesson built on the identical engine** — same shell, same phase machine, same gamification math, same audio architecture, same exact visual language — themed entirely around **2D Shapes: Square, Rectangle, Triangle, and Circle**.

No visual element, layout primitive, spacing system, color token, animation curve, or interaction pattern should diverge from the reference unless explicitly called out in this document as a deliberate, topic-driven exception.

**What must be different:** mascot identity, story narrative and characters, all story illustrations, all simulation mechanics' subject matter (now shape-attribute exploration instead of place-value/regrouping), all 100 question texts, all 10 world names/themes, all narration scripts (new ElevenLabs-generated audio), and the lesson's specific learning objectives (2D shape recognition and properties, not subtraction).

**What must be identical:** the five-phase shell and its top navigation bar, the color system, the typography system, the card/pill/button anatomy, the mascot-avatar-plus-speech-bubble pattern, the progress/percentage UI, the gamification HUD (stars/lives/streak), the audio toggle behavior, the ElevenLabs voice pipeline, the responsive breakpoints, and the underlying React component architecture pattern.

---

## 2. Product Vision & Goals

### Vision
Deliver Lesson 9.1 of Intellia's Grade 2 Math course as a pixel-and-behavior match to the studio's existing flagship module, so that a student moving from the Subtraction lesson (or the Multiplication lesson) into this Geometry lesson experiences **zero relearning of the interface** — only new content: shapes, their properties, and a new story. Familiarity of *form* lets cognitive load go entirely toward the *content*: recognising, naming, comparing, and reasoning about squares, rectangles, triangles, and circles.

### Goals & Metrics

| Goal | Metric | Notes |
|---|---|---|
| Learning Completion | ≥85% of students complete all 5 phases | Same bar as reference module's implied target |
| Practice Engagement | ≥90% attempt at least 10 practice questions (1 world) | |
| Score Achievement | Average challenge score ≥75% on first attempt across all 100 Qs | |
| Session Duration | Average engagement ≥14 minutes per session | Wonder 1-2m, Story 2-3m, Simulate 4-5m, Play 5-6m, Reflect 1-2m |
| Curriculum Alignment | 100% aligned to Singapore MOE Primary 2 Section 9.1 | Verified against `intelliasg.com` live curriculum tree |
| Phase Progression | ≥80% reach Play phase in a single session | |
| Shape Fluency (terminal) | ≥80% correctly identify/name/classify all 4 shapes by their defining properties by session end | New metric specific to this lesson's recognition + reasoning goal |
| **Design Parity** | **100% structural/visual/audio parity with reference module, verified via the QA checklist in the companion TRD §17** | **New, mandatory acceptance gate for this build** |

---

## 3. Target Users

### Primary: Grade 2 Students (Age 7–8)
- This is the **first lesson** of Section 9 (Geometry) — no prior in-course shape lessons to bridge from; the module must be self-contained and assume only everyday/Grade-1-level exposure to shape *names*, not their formal properties
- Beginning to reason about shape *attributes* (number of sides, number of corners/vertices, straight vs. curved edges) rather than just shape *recognition*
- Short attention spans (5–8 minute focus windows per phase); respond to bright gold reward color, mascot praise, and audio narration more than text alone
- Singapore school/home context: HDB window grilles, playground equipment, food (roti, pizza, kueh), road signs, classroom objects are far more resonant than generic Western imagery

### Secondary: Parents & Teachers
- Assign as classwork/homework as the entry point to Section 9 (Geometry)
- Expect visible, strict MOE curriculum alignment (this doc cites the exact syllabus chapter)
- No backend dashboard in v1.0 — visibility is in-session only (XP/stars/badges on screen, session resumable for 24h via localStorage)

---

## 4. Curriculum Alignment — Singapore MOE Primary 2

**Topic:** 2D Shapes: Square, Rectangle, Triangle, Circle — **Lesson 9.1**
**Course Tree (confirmed live from intelliasg.com/courses/grade-2-math/), Section 9 — Geometry:**

```
9. Geometry  (Students explore shapes and spatial understanding)
   9.1 2D shapes: square, rectangle, triangle, circle   <- THIS MODULE
   9.2 3D shapes: cube, cuboid, cone, sphere
   9.3 Identifying shapes in daily life
   9.4 Introduction to symmetry
```

### Source Curriculum Reference
**Targeting Mathematics Primary 2A/2B** (Casco Publications) — Geometry / Shapes chapter:
- Recap (light, Grade-1-level): shapes are everywhere; naming shapes informally
- **Square:** 4 equal straight sides, 4 equal corners (right angles)
- **Rectangle:** 4 straight sides (opposite sides equal in length), 4 equal corners (right angles)
- **Triangle:** 3 straight sides, 3 corners
- **Circle:** 1 continuous curved edge, no straight sides, no corners
- Comparing and sorting shapes by number of sides and corners
- Identifying shapes regardless of size/orientation/rotation (a rotated square is still a square)
- Distinguishing squares from rectangles (a square is a special rectangle — light introduction, not over-formalized at this grade)
- Simple shape-pattern and shape-combination reasoning ("Let's Think Along" extension problems)

### MOE Learning Objectives Covered

| Code | Objective |
|---|---|
| LO1 | Identify and name squares, rectangles, triangles, and circles |
| LO2 | Describe shapes by their number of sides |
| LO3 | Describe shapes by their number of corners (vertices) |
| LO4 | Distinguish straight-sided shapes from curved shapes (circle) |
| LO5 | Recognise that a shape's identity does not change with size, color, or rotation/orientation |
| LO6 | Compare and sort shapes using one or more attributes (sides, corners) |
| LO7 | Identify squares as a special case of rectangles (equal-sided rectangle) — introduced lightly |
| LO8 | Apply shape knowledge to real-world Singapore-context objects |
| LO9 | Solve simple one-step reasoning problems involving shape attributes |

### CPA Progression Mapping (Concrete -> Pictorial -> Abstract)

| Stage | Representation | Where It Appears |
|---|---|---|
| Concrete | Manipulable on-screen shape tiles/cut-outs the student can drag, rotate, resize | Simulate Station A |
| Pictorial | Side/corner-counting overlays on shape outlines; sorting diagrams | Simulate Stations B & C; Story illustrations |
| Abstract | Naming/classifying from a verbal description alone ("I have 3 sides — what am I?"); attribute-based logic questions | Simulate Station D; Play phase questions |

### Scope Boundaries
- Shapes covered: **square, rectangle, triangle, circle only** (no pentagon/hexagon/other polygons — that is out of scope for this Grade 2 lesson)
- No formal angle-degree measurement (right angle is described as "a square corner," not "90 degrees")
- No 3D shapes (that is Lesson 9.2, a separate module)
- No perimeter/area calculation (that is a later-grade topic)

---

## 5. The 5-Phase Learner Journey — Structural Parity Specification

The reference module's top-of-screen navigation is a **single pill-shaped container** holding 5 horizontally arranged phase segments. This exact shell is reused without modification to its anatomy:

```
+----------------------------------------------------------------------------+
|  [01 Wonder x]  [02 Story x]  ((03 Simulate))  [04 Play]  [05 Reflect]     |
+----------------------------------------------------------------------------+
```

**REFERENCE BEHAVIOR (observed in screenshots):**
- The tracker is a single dark rounded-pill bar (background approx `#241B47`), centered at the top of the viewport, sitting independently of a "Home" pill fixed to the top-left corner.
- Each of the 5 segments shows: a two-digit step number ("01"–"05"), an emoji icon, and a label.
- **Completed** phases render their label in green with a trailing checkmark (e.g., "01 Wonder ✓").
- The **active** phase is visually distinguished by being wrapped in its own nested, slightly lighter/elevated pill (a "pill within the pill"), with its label rendered in gold/amber and bold weight — this is the strongest visual weight on the bar.
- **Future/incomplete** phases render in a muted lavender-gray, no checkmark, no nested pill.
- A **thin horizontal progress bar** sits directly beneath the tracker only during the Story and Play phases (not Wonder/Simulate/Reflect) — gold fill against a dark track, representing slide/question progress within that phase specifically (distinct from the 5-phase tracker above it, which represents lesson-level progress).
- Clicking "Home" at any point returns to the Landing Screen (§6.1) without losing session state (resumable via localStorage).

**THIS MODULE:** Identical shell, identical states (completed/active/future), identical nested-pill active treatment, identical green-checkmark completed treatment. Only the icons differ to reflect topic-appropriate emoji per phase (final emoji selection in §5.1 table) — labels for the phase NAMES themselves (Wonder/Story/Simulate/Play/Reflect) remain the same since they represent the *engine's* phase machine, not lesson content.

### 5.1 Phase Map

| # | Phase | Icon (this module) | Duration | Purpose |
|---|---|---|---|---|
| 01 | **Wonder** | Magnifying glass over a shape | 1–2 min | Pose a shape-identity mystery rooted in a relatable scenario |
| 02 | **Story** | Open book | 2–3 min | 4-slide illustrated narrative introducing shape attributes |
| 03 | **Simulate** | Pencil | 4–5 min | 4-station hands-on sandbox (Concrete -> Pictorial -> Abstract) |
| 04 | **Play** | Game controller | 5–6 min | IntelliPlay(TM) — 100 randomised questions across 10 worlds |
| 05 | **Reflect** | Clipboard | 1–2 min | Journal/AI reflection prompt; unlocks final completion badge |

---

## 6. Screen-by-Screen Specification

### 6.1 Landing Screen

**REFERENCE BEHAVIOR (captured screenshot, `/` route):**
A single large rounded card (background approx `#26195C`, corner radius ~28px, subtle outer glow) is centered in the viewport against the dotted indigo backdrop, containing, top to bottom, center-aligned:

1. A small pill badge at the very top of the card: light-bordered, muted background, sparkle emoji + small caps text — `"Singapore MOE Curriculum · Grade 2"`.
2. A two-line page title in large bold display type: first line in white, second line in gold/amber — the second line is always the "hook" word and always gold.
3. A horizontal row: a circular gold mascot avatar (~56px) on the left containing an emoji face, beside a white rounded speech-bubble (with left-pointing tail) containing a short first-person greeting line ending in an emoji.
4. A 2–3 sentence descriptive paragraph in muted lavender-white, center-aligned, max-width constrained (~600px) introducing the mascot character by name and the lesson promise.
5. A secondary nested card/panel (background slightly different shade, approx `#2E2270`) labeled top-left in small gold caps `"YOUR LEARNING JOURNEY"`, containing the 5 phase-name chips (icon + label only, no numbers) connected by right-arrow glyphs, wrapping to a second row for the 5th chip.
6. A large primary CTA: full pill shape, solid gold/amber fill, bold dark-navy text, rocket emoji + `"Begin Your Journey!"`, with a soft gold glow/shadow beneath it.
7. A row of 3 feature highlight cards below the CTA, each a small rounded rectangle (darker shade than the main card) containing a centered icon/emoji, and one line of label text.

**THIS MODULE — content mapping (mechanism identical, content new):**

| Reference Element | This Module's Content |
|---|---|
| Badge pill | `"Singapore MOE Curriculum · Grade 2"` (unchanged — same curriculum tier) |
| Title line 1 (white) | `"Exploring 2D"` |
| Title line 2 (gold) | `"Shapes!"` |
| Mascot name | New mascot — see §9.5 for full identity spec |
| Mascot greeting | `"Ready to go shape-spotting? Let's go!"` |
| Descriptive paragraph | `"Join Pip the Geometric Penguin and discover the secrets of squares, rectangles, triangles, and circles — through stories, simulations, and exciting games!"` (placeholder phrasing; final copy in Content Bible, §13) |
| Journey chips | Wonder -> Story -> Simulate -> Play -> Reflect (same engine labels) |
| CTA | `"Begin Your Journey!"` (unchanged copy — generic enough to reuse) |
| Feature card 1 | `"4 Shapes to Master"` |
| Feature card 2 | `"4 Simulations"` |
| Feature card 3 | `"10 Shape Worlds"` |

### 6.2 Phase 1 — Wonder

**REFERENCE BEHAVIOR (`/wonder` route):**
- Top: mascot avatar (smaller, ~48px) + speech bubble, left-aligned as a pair, positioned just below the phase tracker — text is a short thinking line, e.g. `"Hmm... I wonder..."`.
- Center: a large circular icon badge (~96–110px diameter, light purple/lavender translucent fill approx `#6B5CA0` at reduced opacity) containing a single bold symbol — in the reference, a red question mark glyph.
- Below the icon, inside a dark card (background approx `#2A2152`, rounded ~20px, generous padding ~32-40px):
  - A bold white headline question (approx 28-30px), center-aligned, 1–2 lines.
  - An italic, smaller, muted-lavender sub-question beneath it.
  - A highlighted hint pill (background approx `#3A2D63`, rounded rectangle ~12px radius, NOT a full pill), gold/amber bold text bookended by sparkle emoji.
- Below the card, outside it: a large gold CTA pill button with a magnifying-glass emoji, `"Let's Investigate!"` — clicking advances to Story.
- Bottom-right: a fixed circular audio-toggle button (gold fill, white speaker icon, drop shadow) — toggles narration on/off.

**THIS MODULE:**

| Element | This Module's Content |
|---|---|
| Mascot thinking line | `"Hmm... I wonder..."` (generic enough to reuse verbatim) |
| Icon badge symbol | A shape-outline glyph (e.g., a square overlapping a circle) in place of "?" (same circular badge treatment, new glyph) |
| Headline question | `"A window grille has 4 straight sides and 4 corners that look exactly the same. A clock on the wall has no corners at all. What shapes are they?"` |
| Sub-question | `"What if we counted the sides and corners to find out?"` |
| Hint pill | `"We could count the sides and corners to be sure!"` |
| CTA | `"Let's Investigate!"` (unchanged — generic) |

### 6.3 Phase 2 — Story

**REFERENCE BEHAVIOR (`/story` route):**
- Phase tracker shows thin gold progress bar beneath it now active, with a row below reading `"Slide 1 of 4"` (left) and `"25%"` (right) — percentage = `(slideIndex+1)/totalSlides`.
- A row of small progress dots is centered between the two labels — current slide's dot is an elongated gold pill, future dots are small muted circles.
- A large rounded card (same dark card treatment as Wonder) containing, top to bottom:
  - A full-width illustrated scene image (rounded corners, ~16:9-ish ratio) — flat/semi-flat children's-book vector illustration style, NOT photographic, NOT 3D-render.
  - A gold bold slide title beneath the image, left-aligned.
  - A paragraph of narrative body text, white, left-aligned, 2–4 sentences.
  - A highlighted equation/fact pill (same visual treatment as the Wonder hint pill — dark violet bg, gold bold text, sparkle-bookended).
  - A mascot-avatar + speech-bubble pair (same component as Wonder, reused), giving a strategic nudge for the NEXT slide.
- Bottom-right: a `"Next ->"` button, dark pill with white text and border, advancing the slide index; on the final slide this becomes the transition into Simulate.
- Audio toggle button persists bottom-right (same as Wonder).

**THIS MODULE — 4-Slide Story Arc ("Pip's Shape Hunt at the Playground"):**

| Slide | Title | Illustration Brief | Body Copy Direction | Fact Pill | Mascot Nudge |
|---|---|---|---|---|---|
| 1/4 | "Pip's Shape Hunt" | A cheerful playground scene: a penguin character looking up at a play structure with a square climbing frame, a round roundabout, a triangular flag, and a rectangular bench — flat warm-toned illustration matching the reference's children's-book style | Pip the Penguin loves the playground. Today, Pip notices something interesting — every single thing here is built from just four simple shapes! | `"4 Shapes Everywhere!"` | "Let's look closely at each one together!" |
| 2/4 | "Counting Sides and Corners" | Close-up illustration of the square climbing frame with its 4 sides and 4 corners highlighted/numbered | The climbing frame is a square. It has 4 sides that are all the same length, and 4 corners that look exactly the same. | `"Square: 4 sides, 4 equal corners"` | "A square's sides are always equal — that's its secret!" |
| 3/4 | "The Round Roundabout" | Illustration of the circular roundabout, with a dotted curved line tracing its one continuous edge | The roundabout is round all the way around — it's a circle! A circle has no straight sides and no corners at all, just one smooth curve. | `"Circle: 0 sides, 0 corners"` | "No corners to bump into on a circle!" |
| 4/4 | "Triangle Flag and Rectangle Bench" | Wide shot showing the triangular flag bunting and the rectangular bench side-by-side, sides/corners labeled on each | The flag is a triangle with 3 straight sides and 3 corners. The bench is a rectangle with 4 straight sides — but only the opposite sides match in length! | `"Triangle: 3 sides · Rectangle: 4 sides"` | "Now you know all four shapes — let's go practice!" |

### 6.4 Phase 3 — Simulate

**REFERENCE BEHAVIOR (`/simulate` route):**
- Below the phase tracker: a centered section header — pencil emoji + `"Simulate"` in gold bold, with a muted subtitle beneath, e.g. `"Explore and discover — no wrong answers!"`.
- A **secondary tab row** directly beneath: 4 lettered station tabs, each a rounded-rectangle pill containing a colored letter badge (A/B/C/D, each badge a distinct solid color — purple, green, gold, orange observed in reference) + icon emoji + station name. The **active** tab has a gold/amber background fill and dark text; inactive tabs are dark/muted with white text.
- Below the tabs, the main simulation card (same dark card treatment, approx `#2A2152`):
  - Station title (gold, bold, icon-prefixed) + one-line muted instruction beneath it.
  - The live interactive visual area — in the reference's "Slider" station, this shows two large color-coded numbers either side of an operator, a labeled slider beneath with a gold draggable thumb on a dark track, and live-updating feedback text.
  - A secondary feedback panel/box (darker nested rectangle) showing live, color-coded step-by-step working.
  - A horizontal status banner beneath the working panel — color-coded by state — paired with a regenerate button (dark pill, white text).
  - Bottom row: `"<- Previous Station"` / `"Next Station ->"` navigation buttons (dark pills, white text, arrow icons).
- Audio toggle persists bottom-right.

**THIS MODULE — 4 Stations:**

| Tab | Badge Color | Station Name | CPA Stage | Mechanic |
|---|---|---|---|---|
| A | Purple | Shape Builder | Concrete | Drag vertices/edges on a flexible on-screen shape tile to morph it; the shape's name updates live based on side/corner count |
| B | Green | Side & Corner Counter | Pictorial | Tap each side and each corner of a displayed shape to count them aloud; live tally + auto-classification |
| C | Gold | Shape Sorter | Pictorial->Abstract | Drag falling/floating shape tiles into the correct labeled bin (Square / Rectangle / Triangle / Circle) |
| D | Orange | Mystery Shape | Abstract | Read a clue ("I have 3 sides and 3 corners") and select the matching shape from a set of options |

**Station B detail (mirrors the reference's "Slider" station most closely, as the most complex/most fully captured reference station):**
- Two large color-coded numbers either side of a central label, mirroring the reference's two-number-plus-operator layout exactly in structural logic — here repurposed as **"Sides: 4"** (gold) and **"Corners: 4"** (purple), live-updating as the student taps around a displayed shape outline.
- A labeled progress indicator beneath, e.g. `"Sides counted: 3 of 4"`, gold-filled dash-track (replacing the reference's slider with a tap-counter, since this station's interaction model is discrete taps, not a continuous drag — see Engineering Note below).
- A "shape preview" tile showing the current shape with numbered tap-points appearing on each side/corner as they're tapped.
- Live feedback panel shows the running classification logic, e.g. `"4 sides + 4 equal corners = this is a Square!"`, with the final answer in gold bold — directly mirroring the reference's "Ones: 13 − 8 = 5 / Tens: 5 − 2 = 3 / 63 − 28 = 35" stepped-working panel structure.
- `"New Shape"` button replaces `"New Number"` in the same position/style — cycles to a new random shape (square/rectangle/triangle/circle) at a new size/rotation.
- `"<- Previous Station" / "Next Station ->"` unchanged.

> **Engineering Note (deliberate, flagged exception):** The reference's Station C ("Slider") uses a continuous drag-slider because subtraction regrouping is a continuous numeric domain (any ones-digit 0–9). Counting sides/corners is a discrete, small-integer domain (0–4), so this module substitutes a **tap-counter** interaction for the slider-drag interaction at this specific station, while preserving the exact panel layout, color-coding, and feedback-panel anatomy. This is the one intentional mechanic-level adaptation in the entire Simulate phase, made because a slider would be developmentally inappropriate for counting whole, small, discrete attributes — a continuous slider implies infinitely divisible quantities, which miscommunicates the math. All other visual chrome remains identical.

### 6.5 Phase 4 — Play (IntelliPlay)

#### 6.5.1 World Select Screen

**REFERENCE BEHAVIOR (`/play` route, pre-selection state):**
- Centered header: game-controller emoji + `"Choose Your World!"` in bold white, subtitle beneath in muted lavender: `"Beat each world to unlock the next. Earn stars and XP!"`.
- A vertically stacked list of world cards, each a full-width rounded card (dark, approx `#241B4D`):
  - **Unlocked/current world:** a colored circular icon on the left, world name (bold white) + one-line difficulty descriptor (muted gray) stacked beside it, and a green pill `"PLAY"` button on the right.
  - **Locked worlds:** a muted orange/tan circular lock-icon badge replaces the colored circle; world name renders in muted gray (not white); descriptor text also muted; NO play button.

**THIS MODULE — 10 Worlds (vs. reference's 3 shown):**
Because this module's Play phase spans 100 questions across 10 worlds (vs. the reference's apparent 3), the World Select screen must support a **scrollable list** of 10 cards using the identical card anatomy. This is a content-volume scaling of the same component — no new component, no new visual language, just more rows in the same scrollable container. See §8.4 for full world list and theming.

#### 6.5.2 Quiz Screen

**REFERENCE BEHAVIOR (`/play` route, in-question state):**
- Beneath the phase tracker: a world-name pill, centered, dark rounded-pill containing a small colored dot icon + bold world name.
- A **stats HUD bar** directly beneath: a full-width dark rounded rectangle split into 3 zones — left: gold star icon + count; center: 3 heart icons, filled pink/red, representing lives; right: fire emoji + streak multiplier.
- Beneath the stats bar: a question-progress row — left: `"Question 1/8"` (reference shows 8 per world — resolved per-module, see §8.4), right: percentage; beneath both, a thin horizontal progress bar (gold fill on dark track).
- The main question card (dark rounded card): bold centered question text, beneath it a **2×2 grid of large answer buttons** — each a rounded rectangle, dark-violet fill, bold white centered content, generous padding, equal width/height, comfortable gutter between them.
- **Answer button states:** default -> on tap: correct answer flashes green with a bounce/scale animation + check icon; incorrect tapped answer flashes coral/red with a shake animation, while the correct answer simultaneously highlights green.

**THIS MODULE:**

| Element | This Module's Treatment |
|---|---|
| World-name pill | e.g., `"Square Street"` (colored dot matches that world's icon color from World Select) |
| Stats HUD | Identical 3-zone bar: stars · lives · streak — unchanged mechanic, unchanged layout |
| Question counter | `"Question 1/10"` *(this module standardizes on 10 questions/world for clean 10×10=100 math — see §8.4 resolution note)* |
| Question card | Bold centered shape question — note: many questions in this module are **visual** (a rendered SVG shape) rather than purely textual, so the question card must support an optional inline shape-render slot between the question text and the answer grid (see §8.1 for which question types need this) |
| Answer grid | Identical 2×2 large-button MCQ grid; for shape-identification questions, button content may itself be a small rendered shape icon instead of text/number — same button anatomy, swappable content slot |

---

## 7. Phase 5 — Reflect (Specification New, Not Fully Captured in Screenshots)

Since the Reflect phase was not captured in the provided screenshots, its specification is derived from the lesson-engine's documented phase contract (consistent card/mascot/CTA visual language established in §6.1–6.4):

- Mascot appears center-top in a "celebrating" or "thinking" mood state, speech bubble containing the reflection prompt.
- A text-input card (same dark card treatment) with a placeholder prompt: `"Tell me one way to spot a square in real life!"`.
- Optional secondary mode: a LearnFlow AI chat-style free-text or speech-to-text input, styled as a scrollable message thread within the same card shell (white bubbles for "AI", gold-tinted bubbles for the student's own input).
- On submit: full-screen completion celebration — mascot in "celebrating" mood, confetti/particle burst animation (reusing the existing dot/particle background system, temporarily intensified), summary stats card (Total XP, Stars earned, Badges unlocked, Overall accuracy %), and two CTAs: `"Replay Lesson"` (secondary, dark pill) and `"Return Home"` (primary, gold pill).

---

## 8. Phase 4 — Question Bank (100 Randomised Questions)

### 8.1 Question Types (10 types × 10 questions = 100)

| Type | Description | Needs Visual Render? | Example |
|---|---|---|---|
| Q1 | Name the shape (visual shown) | Yes | [Shows a rendered triangle] "What shape is this?" |
| Q2 | Count the sides | Yes | [Shows a rendered rectangle] "How many sides does this shape have?" |
| Q3 | Count the corners | Yes | [Shows a rendered square] "How many corners does this shape have?" |
| Q4 | Attribute-to-shape (reverse) | No | "I have 3 straight sides and 3 corners. What shape am I?" |
| Q5 | True/False — attribute check | Yes | [Shows a circle] "True or False: This shape has 4 corners." |
| Q6 | Odd one out (which doesn't belong) | Yes (4 small shapes) | "Which shape has no straight sides?" |
| Q7 | Real-world object matching | No (or small icon) | "A wall clock is shaped most like a ___." |
| Q8 | Square vs. rectangle distinction | Yes | [Shows a non-square rectangle] "Is this shape a square? Why or why not?" (simplified to MCQ) |
| Q9 | Sorting/classification | Yes (set of shapes) | "Which of these shapes has the MOST corners?" |
| Q10 | Pattern/reasoning | Yes (sequence) | "Square, Circle, Square, Circle, ___. What comes next?" |

### 8.2 Question Distribution & Difficulty

| Type | Count | Easy | Medium | Hard |
|---|---|---|---|---|
| Q1 | 10 | 5 | 3 | 2 |
| Q2 | 10 | 4 | 4 | 2 |
| Q3 | 10 | 4 | 3 | 3 |
| Q4 | 10 | 3 | 4 | 3 |
| Q5 | 10 | 4 | 3 | 3 |
| Q6 | 10 | 5 | 3 | 2 |
| Q7 | 10 | 4 | 4 | 2 |
| Q8 | 10 | 3 | 4 | 3 |
| Q9 | 10 | 3 | 4 | 3 |
| Q10 | 10 | 3 | 4 | 3 |
| **Total** | **100** | **38** | **36** | **26** |

### 8.3 Difficulty Definitions
- **Easy:** Single shape shown in default orientation (axis-aligned), high color contrast, large size; straightforward "what/how many" questions
- **Medium:** Shape shown rotated or at unusual scale; questions requiring one reasoning step (e.g., "this looks like a diamond — is it still a square?")
- **Hard:** Multi-shape comparison, square-vs-rectangle distinction, reverse attribute-to-shape questions, pattern reasoning, real-world object abstraction

### 8.4 World Map — Resolution of Reference Discrepancy & Final Spec

**Discrepancy noted:** the reference screenshots show "Question 1/8" (implying 8 questions/world) and 3 total worlds with the 3rd locked/themed as a mixed-bag finale. This module's brief calls for **up to 100 randomised questions**. Resolution: this module standardizes on a clean **10 worlds × 10 questions = 100** structure (rather than replicating the reference's 8-per-world, 3-world count), since 100 is an explicit, hard product requirement. The world CARD component, lock-iconography, and PLAY-button mechanic are otherwise unchanged.

| World # | Theme Name | Icon Color | Questions | Focus | Difficulty |
|---|---|---|---|---|---|
| 1 | Square Street | Blue | 1–10 | Square recognition, sides/corners | Easy |
| 2 | Rectangle Row | Green | 11–20 | Rectangle recognition, sides/corners | Easy–Med |
| 3 | Triangle Town | Teal | 21–30 | Triangle recognition, sides/corners | Medium |
| 4 | Circle City | Pink | 31–40 | Circle recognition, curved vs. straight | Medium |
| 5 | Shape Sorting Yard | Orange | 41–50 | Mixed sorting/classification | Med–Hard |
| 6 | Corner Count Carnival | Purple | 51–60 | Corner-counting across all 4 shapes | Medium |
| 7 | Side Street Bazaar | Cyan | 61–70 | Side-counting across all 4 shapes | Hard |
| 8 | Square-or-Rectangle Lab | Gold | 71–80 | Square vs. rectangle distinction | Hard |
| 9 | Real World Shape Safari | Red | 81–90 | Real-world object matching | Hard |
| 10 | Mystery Shape Palace | Rainbow/multi | 91–100 | Mixed, all types, reverse/pattern reasoning | Hard |

World 1 unlocked by default; each subsequent world unlocked at ≥6/10 correct (1-star minimum) on the prior world — same gating logic as implied by the reference's lock iconography.

### 8.5 Singapore Context Names
Wei Ming, Priya, Raju, Ahmad, Mia, Jun, Siti, Ryan, Xiao Ling, Aisha, Mei, Kavya

### 8.6 Singapore Context Real-World Object Pool (for Q7-type questions)
HDB window grille (square/rectangle), roti prata / pizza (circle), traffic "give way" sign (triangle), classroom whiteboard (rectangle), wall clock (circle), kite (square/triangle combinations), zebra crossing stripes (rectangle), manhole cover (circle), road "yield" sign (triangle), book cover (rectangle), button (circle), birthday party hat (triangle/cone-like 2D face)

---

## 9. Gamification Design

### 9.1 Reward System (mirrors reference HUD exactly)

| Mechanic | Rule |
|---|---|
| Stars | Earned per 10-question world (1–3 stars based on score: 9-10 correct=3 stars, 7-8=2 stars, 5-6=1 star, <5=0 stars) |
| XP | 10 XP correct first try, 7 XP second try, 5 XP with hint used |
| Lives | 3 lives per world attempt; lose 1 heart per incorrect answer; world attempt ends if lives reach 0 (must retry world) |
| Streak | Fire multiplier increases with consecutive correct answers: 1x (0-4 streak) -> 2x (5-9 streak) -> 3x (10+ streak) |
| Streak bonus | +5 XP per correct answer when streak >=5 |

### 9.2 Badges

| Badge | Condition |
|---|---|
| Wonder Seeker | Complete Wonder + Story phases |
| Shape Master | Complete all 4 Simulate stations |
| Geometry Star | Score >=80% overall across all attempted Play questions |
| Perfect Sorter | 10/10 in any single world |
| Streak Legend | Achieve a 10+ answer streak |
| Full Journey | Complete all 5 phases |
| Circle Champion | 100% on World 4 ("Circle City") |
| Triangle Titan | 100% on World 3 ("Triangle Town") |

### 9.3 Feedback Mechanics

| Event | Treatment |
|---|---|
| Correct | Answer button flashes green, bounce/scale-in animation, chime sound, mascot celebratory line, e.g. `"Fantastic! You spotted it perfectly!"` |
| Incorrect | Tapped button flashes coral/shakes; correct answer simultaneously highlights green; low-tone sound; mascot encouragement, e.g. `"Let's try again — count the sides carefully!"` |
| Hint 1 | The shape's sides/corners are highlighted/numbered inline |
| Hint 2 | A side-by-side comparison with a known reference shape appears |
| After 2 fails | Answer revealed with full animated explanation; no further penalty |
| Scoring policy | No negative scoring — encouragement-first, always (matches reference's "no wrong answers" framing in Simulate, extended in spirit to Play) |

### 9.4 World Map Mechanics
See §8.4 for full 10-world table. Lock icon (orange/tan circular badge) used for any world below the player's current unlock threshold; unlocked-but-not-completed worlds show colored icon + "PLAY"; completed worlds show colored icon + star rating + "REPLAY".

### 9.5 Mascot — New Character Identity Spec

The reference mascot is **"Zara the Fox"**, gold circular avatar, appears in Wonder/Story/Reflect, mood states idle/curious/happy/thinking/celebrating.

**This module's mascot must be a distinct character** (different species/identity, NOT a recolored fox) while matching exact avatar mechanics:
- **Proposed identity:** *"Pip the Geometric Penguin"* — penguins have a naturally rounded, simple, shape-friendly silhouette that pairs well with a topic about shapes, and is visually distinct from both the existing fox (subtraction module) and an owl (if reused for another module).
- Same circular gold avatar treatment (~48-56px), same emoji-in-circle simplicity for the MVP build (final bespoke illustrated mascot art is a post-v1.0 enhancement, matching how the reference currently uses an emoji-style avatar rather than custom illustration).
- Same 5 mood states required: idle, curious, happy, thinking, celebrating.
- Appears in identical phase slots: Wonder hook, Story narration (every slide), Simulate station intros (new slot — reference does not show mascot in Simulate, but this module adds brief mascot intro lines per station to reinforce instruction; this is a minor, additive enhancement, not a structural change), and Reflect phase.

---

## 10. UX & Visual Design Requirements — Design Token Specification

### 10.1 Color System (sampled directly from reference screenshots)

| Token | Approx. Hex | Usage |
|---|---|---|
| `--bg-base` | `#1B1442` | Page background base (deep indigo) |
| `--bg-base-glow` | `#2A1F5E` | Lighter glow zone, center/top of background |
| `--surface-card` | `#251C56` – `#2C2266` | Main content cards (Wonder/Story/Simulate/Play cards) |
| `--surface-card-nested` | `#332868` | Nested panels (answer buttons, feedback boxes) |
| `--surface-pill-dark` | `#241B47` | Phase tracker pill background, Home pill |
| `--surface-pill-darkest` | `#150F38` | Home pill background (darkest navy observed) |
| `--accent-gold` | `#F5B82E` | Primary CTA fill, active phase text, hint-pill text, star icon |
| `--accent-gold-deep` | `#F0A830` | Gold button gradient/shadow base |
| `--accent-success-green` | `#3DBA6E` (approx.) | "PLAY" button fill, correct-answer flash, completed checkmarks |
| `--accent-alert-coral` | `#E0556B` (approx.) | Incorrect-answer flash, warning banners, lock icon tint |
| `--text-primary` | `#FFFFFF` | Headlines, question text |
| `--text-muted-lavender` | `#A89FC9` (approx.) | Subtitles, italic sub-questions, descriptors |
| `--text-locked-gray` | `#7A7396` (approx.) | Locked world names/descriptions |
| `--particle-dot` | gold and white at low opacity | Background scatter dots |

> **Engineering note:** these are derived from direct visual sampling of the provided screenshots and should be treated as a strong starting approximation. Before final build, run an automated color-extraction pass (e.g., a script sampling the live reference site's rendered DOM/CSS custom properties directly, since `intellia-substraction.vercel.app` is a live React app and its actual CSS variables can be inspected via browser DevTools) to lock exact hex values with zero drift. This PRD's job is to specify *that* token-for-token matching is the requirement, not to be the final color authority if DevTools inspection is available to the build team.

### 10.2 Shape-Specific Visual Tokens (new for this module)
Since shapes are the literal subject matter, each of the 4 target shapes is assigned a consistent fill/stroke treatment used everywhere it appears (Story illustrations, Simulate stations, Play question renders, World icons) for visual consistency and to aid pattern recognition:

| Shape | Fill Token | Stroke Token |
|---|---|---|
| Square | `--shape-square-fill: #5B8DEF` (blue family) | White, 2-3px |
| Rectangle | `--shape-rectangle-fill: #3DBA6E` (green family) | White, 2-3px |
| Triangle | `--shape-triangle-fill: #F5B82E` (gold family) | White, 2-3px |
| Circle | `--shape-circle-fill: #E0556B` (coral family) | White, 2-3px |

These are deliberately distinct from the UI's own accent-gold/success-green/alert-coral tokens in *role* (shape identity vs. UI state) even where the hex values are shared (e.g., triangle-fill reuses accent-gold) — engineering should treat these as a separate semantic token group so a future change to UI "success green" doesn't accidentally recolor every rectangle in the app.

### 10.3 Typography
- **Font family:** Rounded, playful sans — Nunito or Fredoka One (matching reference's soft, child-friendly letterforms observed in headlines and body text)
- **Headline weight:** Bold/Extrabold, ~28-36px for phase headlines, ~36-44px for Landing Screen title
- **Body weight:** Regular/Semibold, ~16-18px
- **Italic sub-question style:** Regular italic, ~16px, muted lavender color

### 10.4 Component Anatomy Reference Table

| Component | Shape | Corner Radius | Border | Shadow/Glow |
|---|---|---|---|---|
| Home pill | Full pill | 999px | 1px subtle | none |
| Phase tracker bar | Full pill (outer), nested pill (active segment) | 999px outer, ~16px inner | subtle | none |
| Mascot avatar | Circle | 50% | none | subtle |
| Speech bubble | Rounded rect + tail | ~16px | none | subtle |
| Wonder/icon circle | Circle | 50% | none | none |
| Hint/fact pill | Rounded rect (NOT full pill) | ~12px | subtle | none |
| Primary CTA (gold) | Full pill | 999px | none | gold glow, soft blur |
| Main content card | Rounded rect | ~20-28px | none/subtle | soft ambient shadow |
| Station tab | Rounded rect | ~12-14px | none | none |
| Shape-render tile (new) | Square viewport, shape inscribed | ~12px (tile, not shape itself) | none | none |
| Answer button (2×2 grid) | Rounded rect | ~14-16px | none | none default; colored glow on correct/incorrect flash |
| World card | Rounded rect | ~16-18px | none | none |
| Audio toggle (FAB) | Circle | 50% | none | drop shadow |

### 10.5 Motion & Animation Inventory
| Animation | Trigger | Behavior |
|---|---|---|
| Bounce-in | Correct answer | Scale 0.3->1.05->0.9->1.0, opacity 0->1 |
| Shake | Incorrect answer | translateX oscillation +-8px, 4 cycles |
| Slide-in-up | New card/slide appears | translateY 30px->0, opacity 0->1 |
| Pulse-glow | CTA buttons (idle attention cue) | box-shadow radius pulse, gold tint |
| Celebrate | Badge unlock, world complete | rotate +-5deg oscillation + scale |
| Dash-fill | Progress bars, tap-counter fill | stroke-dashoffset animates to 0 |
| Morph (new) | Shape Builder station (drag vertex) | Live polygon point recalculation, no easing needed (1:1 drag tracking) |
| Highlight-pulse (new) | Side/corner tap-counting | Brief glow pulse on the tapped side/corner before settling to a "counted" highlight state |
| Float-up | XP gain (+10 floats off the tapped button) | translateY -60px, scale 1.5, fade out |

### 10.6 Responsive Breakpoints
- Primary: Desktop 1280px+ (confirmed reference test environment — screenshots captured at desktop browser width)
- Secondary: Tablet 768px+ (stacked station tabs may wrap to 2×2 grid instead of 1×4 row)
- Tertiary: Mobile 375px+ (phase tracker may collapse to icon-only chips with labels on tap/hover; world cards remain full-width stacked; shape-render tiles scale down proportionally but never below a legible minimum ~80px)

### 10.7 Accessibility
- All tap targets >=44×44px (answer buttons, station tabs, shape vertices/sides/corners in Stations A & B all sized comfortably above this floor — small geometric hit-targets are a known pitfall for shape-tapping interactions and must be explicitly tested)
- WCAG AA contrast minimum on all text against the dark backgrounds
- Full narration coverage via the ElevenLabs/Web-Speech pipeline (§11) so no content is audio-only or visual-only — critically important for this module since many questions are shape-image-based; the shape's name and attributes must always be available via audio description, not just visually, for any non-sighted or low-vision learner
- Keyboard navigable (tab order through station tabs, answer buttons, CTAs; shape vertex-dragging in Station A needs a keyboard-accessible alternative such as +/- side-count steppers)
- No mandatory time pressure — lives/streak are motivational framing, never hard lockouts mid-question

---

## 11. Audio & Voice Requirements

This module's audio system is a **direct content-swap** of the existing production ElevenLabs pipeline already used by the reference module — same provider, same voice, same per-style settings, same architecture, entirely new narration scripts.

### 11.1 Voice Profile (unchanged from existing pipeline)
- **Provider:** ElevenLabs
- **Voice:** Alice (Clear, Engaging Educator)
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`

### 11.2 Voice Settings by Narration Style

| Style | Stability | Similarity Boost | Style Exaggeration | Speaker Boost |
|---|---|---|---|---|
| `celebration` | 0.12 | 0.45 | 0.75 | Yes |
| `encouragement` | 0.16 | 0.50 | 0.65 | Yes |
| `question` | 0.20 | 0.55 | 0.55 | Yes |
| `emphasis` | 0.16 | 0.50 | 0.60 | Yes |
| `thinking` | 0.24 | 0.60 | 0.35 | Yes |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | Yes |

### 11.3 Strict Content Policy
> Audio is generated **only** for paragraph/body text and question text. Titles, headings, and section labels are **never** narrated — this avoids repetitive title-reading and keeps narration focused purely on instructional content. Every narrated string must have exact 1:1 textual parity with what's rendered on screen — no paraphrasing between the spoken script and the visible UI copy.

### 11.4 Narration Inventory Required for This Module
Every one of the following must be scripted, generated, and mapped before launch:
- 1 Wonder hook line
- 4 Story slide narrations (body paragraphs only, not titles)
- 4 Simulate station instruction lines (one per station)
- 100 question texts (read-aloud on demand, triggered by tapping the question or via auto-read setting) — for visual-only questions (Q1/Q2/Q3/Q5/Q6/Q9 types), the spoken narration must include a full verbal description of the shape shown (e.g., "Look at this shape. It has four straight sides, all the same length.") so the question is never audio-inaccessible
- 100 × 2 hint lines (200 total) + 100 explanation lines for the Play phase
- 1 Reflect prompt line
- Reused generic praise/encouragement lines from the existing pipeline's praise pool ("Amazing!", "Well done!", "Brilliant!", "You got it!" — confirmed reusable verbatim)

### 11.5 Pipeline Behavior (offline pre-generation + dynamic fallback)
- All known narration is pre-generated offline via a Node.js script and stored as static `.mp3` assets for zero-latency playback on low-end classroom devices.
- Any narration text not found in the static map falls back to an on-the-fly ElevenLabs API request.
- If ElevenLabs is unreachable, the system falls back further to the browser's native Web Speech API so narration is never silently broken.
- Playback uses sequential, pre-loading queue management (no gaps/silence between sentences within a single narrated block).

(Full technical implementation of this pipeline — file structure, scripts, audio engine code — is specified in the companion TRD §16.)

---

## 12. Technical Platform Summary

| Aspect | Detail |
|---|---|
| Framework | React 18 (Vite + JSX), single-page, single-file deployable |
| Repo Structure | Mirrors the `numberbound`-pattern repo structure (api/, public/, scripts/, src/) |
| Hosting | Embedded in Intellia SG WordPress at the lesson URL, via iframe or React CDN bundle |
| Browser Support | Chrome, Safari, Edge, Firefox (latest 2 major versions) |
| Auth | None — guest learner access |
| State | `localStorage`, 24-hour session resume |
| Audio | ElevenLabs pre-generated `.mp3` pipeline + Web Speech API fallback |
| Analytics | Deferred to v2 |

Full architecture in the companion TRD.

---

## 13. Content Bible Requirements (Deliverable Alongside Engineering Build)

Before development begins on Story/Simulate/Play content, a **Content Bible** document must be produced and approved containing the final, locked text for:
1. All landing screen copy (title, mascot greeting, descriptive paragraph, feature card labels)
2. All Wonder phase copy
3. All 4 Story slides (title + body + fact pill + mascot nudge, ×4 slides)
4. All 4 Simulate station titles/instructions/tip copy
5. All 100 question texts + 4 MCQ options each + 2 hints + 1 explanation each (1,000+ individual content strings), INCLUDING the exact shape parameters (type, side count, rotation, size) for every visual question so engineering can render them deterministically
6. All 10 world names + descriptors
7. Reflect phase prompt + completion summary copy
8. Final mascot name, full mood-state line variations

This Content Bible becomes the literal source for both the on-screen React component text AND the `generate_audio.js` phrases array (per §11.4), guaranteeing the mandatory 1:1 audio/visual text parity.

---

## 14. Success Criteria (v1.0)

| Criterion | Target |
|---|---|
| All 100 questions randomised correctly, zero repeats per session | Required |
| All 4 simulation stations functional, matching CPA progression | Required |
| All 5 phases navigable end-to-end | Required |
| Gamification (XP, stars, lives, streak, 8 badges) fully working | Required |
| 10-world map progression logic correct, lock-gating verified | Required |
| Audio narration matches on-screen text 1:1 (paragraphs/questions only), including full verbal shape descriptions for visual questions | Required |
| Mobile/tablet/desktop responsive per §10.6 breakpoints | Required |
| Singapore MOE syllabus Section 9.1 100% covered | Required |
| Load time < 3 seconds | Required |
| WCAG AA accessible | Required |
| **Pixel/behavior parity with `intellia-substraction.vercel.app`** across every screen specified in §6, verified via side-by-side screenshot comparison during QA | Required — primary acceptance gate |
| Zero content/text/character overlap with the subtraction (or multiplication) reference modules | Required |
| All rendered shapes are mathematically accurate (true right angles for square/rectangle, true equal sides for square, true circle, true triangle) at every rotation/scale used in the question bank | Required — unique to this module's visual nature |

---

## 15. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student login / account system
- Multiplayer or class competition features
- Parent progress emails
- Print worksheet generation
- Lessons 9.2 (3D shapes), 9.3 (shapes in daily life), 9.4 (symmetry) — separate modules; this PRD covers 9.1 only
- Any shape beyond square/rectangle/triangle/circle (no pentagons, hexagons, etc.)
- Formal angle-degree measurement
- Perimeter/area calculation
- Bespoke illustrated mascot artwork (emoji-avatar treatment is acceptable for v1.0, matching reference's current production fidelity)

---

**Document Version:** 2.0 (Advanced/Detailed Revision) | June 2026
**Product:** Intellia SG — Grade 2 Math, Lesson 9.1
**Curriculum:** Singapore MOE Primary 2 Mathematics, Section 9 (Geometry)
**Reference UI (pixel/behavior source of truth):** `https://intellia-substraction.vercel.app/`
**Reference Repo Pattern:** `https://github.com/dsamyak/numberbound`
**Parent Page:** `https://intelliasg.com/courses/grade-2-math/`
**Audio Pipeline Source:** Existing production ElevenLabs pipeline (`audio_generation_pipeline.md`)
