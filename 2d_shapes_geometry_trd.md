# Technical Requirements Document (TRD) — ADVANCED SPECIFICATION

## 2D Shapes: Square, Rectangle, Triangle, Circle — Grade 2 Math
### Intellia SG | Singapore Primary Mathematics Curriculum (MOE)
### Reference Parity Target: `intellia-substraction.vercel.app`

---

## 0. Scope & Fidelity Statement

This TRD specifies the engineering build for Lesson 9.1, implemented as a **byte-for-byte structural clone** of the reference app's component architecture, CSS design-token system, state machine, and audio pipeline — with **100% new content**. Every component listed below has a direct counterpart observed in the reference screenshots; where the reference component's internal behavior was not fully visible, this document specifies the most consistent inferred behavior and flags it explicitly as **[INFERRED — CONFIRM IN QA]**. This module additionally introduces a **shape-rendering SVG engine** (§13), the one genuinely new technical subsystem required because the subject matter is geometric/visual rather than purely numeric like the reference.

---

## 1. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 (JSX, Vite) | Matches reference repo structure/build |
| Routing | React Router (or internal phase-state router) | Reference uses route-like paths (`/wonder`, `/story`, `/simulate`, `/play`) visible in the browser URL bar in screenshots — confirms client-side routing per phase |
| State Management | `useReducer` (global) + `useState` (local component) | Matches complexity tier of reference |
| Styling | CSS Modules / global CSS with custom properties (CSS variables) + Tailwind utility classes | Matches reference repo CSS approach |
| Icons | Lucide React + native emoji | Reference mixes custom icon glyphs with emoji |
| Animation | CSS keyframes + transitions; Framer Motion optional for vertex-drag morphing | No heavy dependency required for core animations |
| **Shape Rendering** | **Inline SVG (React components), parametric polygon/circle generator** | Core new subsystem for this module — see §13 |
| Persistence | `localStorage` | Session state, 24h resume, no backend |
| Audio (Primary) | Pre-generated ElevenLabs `.mp3` assets | Zero-latency, matches reference pipeline |
| Audio (Secondary Fallback) | Dynamic ElevenLabs API call via proxy | For any text missed in pre-generation |
| Audio (Tertiary Fallback) | Web Speech API (`SpeechSynthesisUtterance`) | Browser-native, guarantees narration never silently fails |
| Math/Logic | Vanilla JS (trigonometry for polygon vertex generation) | No library needed |
| Build Tool | Vite | Matches reference repo |

---

## 2. URL / Route Map

| Reference Route (observed) | This Module's Route |
|---|---|
| `intellia-substraction.vercel.app/` | `intellia-shapes.vercel.app/` (or final assigned subdomain) |
| `/wonder` | `/wonder` |
| `/story` | `/story` |
| `/simulate` | `/simulate` |
| `/play` | `/play` |
| *(not captured)* | `/reflect` |

Single-page app with cosmetic routing — phase transitions update both the URL (via `history.pushState` or React Router) and the reducer's `phase` field simultaneously; refreshing mid-lesson on `/simulate` restores Simulate phase state from `localStorage`, not bounce to Landing.

---

## 3. Project Structure (mirrors `numberbound` repo pattern)

```
2d-shapes-square-rectangle-triangle-circle/
├── public/
│   ├── images/
│   │   ├── mascot-idle.svg
│   │   ├── mascot-happy.svg
│   │   ├── mascot-thinking.svg
│   │   ├── mascot-curious.svg
│   │   ├── mascot-celebrate.svg
│   │   ├── story-bg-playground-1.svg   # Slide 1 illustration
│   │   ├── story-bg-playground-2.svg   # Slide 2 illustration
│   │   ├── story-bg-playground-3.svg   # Slide 3 illustration
│   │   ├── story-bg-playground-4.svg   # Slide 4 illustration
│   │   ├── world-icon-square.svg
│   │   ├── world-icon-rectangle.svg
│   │   ├── world-icon-triangle.svg
│   │   ├── world-icon-circle.svg
│   │   ├── world-icon-sorting.svg
│   │   ├── world-icon-corners.svg
│   │   ├── world-icon-sides.svg
│   │   ├── world-icon-lab.svg
│   │   ├── world-icon-safari.svg
│   │   └── world-icon-palace.svg
│   └── assets/
│       └── audio/                       # Pre-generated ElevenLabs .mp3 files (1 per narrated phrase)
│           ├── audio_pip_the_penguin_loves_the_playground_0.mp3
│           ├── audio_a_window_grille_has_4_straight_sides_0.mp3
│           └── ... (400+ files per full narration inventory, see PRD §11.4)
├── src/
│   ├── main.jsx
│   ├── App.jsx                          # Root component, global reducer, router
│   ├── App.css                          # Global styles, CSS custom properties (design tokens, §6)
│   ├── routes/
│   │   ├── LandingRoute.jsx
│   │   ├── WonderRoute.jsx
│   │   ├── StoryRoute.jsx
│   │   ├── SimulateRoute.jsx
│   │   ├── PlayRoute.jsx
│   │   └── ReflectRoute.jsx
│   ├── components/
│   │   ├── chrome/
│   │   │   ├── HomePill.jsx
│   │   │   ├── PhaseTracker.jsx
│   │   │   ├── PhaseSegment.jsx
│   │   │   ├── SubProgressBar.jsx
│   │   │   └── AudioToggleFAB.jsx
│   │   ├── landing/
│   │   │   ├── LandingCard.jsx
│   │   │   ├── CurriculumBadge.jsx
│   │   │   ├── LessonTitle.jsx
│   │   │   ├── MascotGreetingRow.jsx
│   │   │   ├── JourneyMapPanel.jsx
│   │   │   ├── BeginJourneyButton.jsx
│   │   │   └── FeatureCardRow.jsx
│   │   ├── wonder/
│   │   │   ├── WonderIconBadge.jsx      # Shape-outline glyph badge
│   │   │   ├── WonderQuestionCard.jsx
│   │   │   └── InvestigateButton.jsx
│   │   ├── story/
│   │   │   ├── SlideProgressRow.jsx
│   │   │   ├── StorySlideCard.jsx
│   │   │   └── NextSlideButton.jsx
│   │   ├── simulate/
│   │   │   ├── SimulateHeader.jsx
│   │   │   ├── StationTabBar.jsx
│   │   │   ├── StationTab.jsx
│   │   │   ├── ShapeBuilderStation.jsx     # Station A: drag vertices to morph
│   │   │   ├── SideCornerCounterStation.jsx# Station B: tap-to-count
│   │   │   ├── ShapeSorterStation.jsx      # Station C: drag into bins
│   │   │   ├── MysteryShapeStation.jsx     # Station D: clue -> shape match
│   │   │   ├── StatusBanner.jsx
│   │   │   └── StationNavButtons.jsx
│   │   ├── play/
│   │   │   ├── WorldSelectHeader.jsx
│   │   │   ├── WorldCard.jsx
│   │   │   ├── WorldList.jsx
│   │   │   ├── WorldNamePill.jsx
│   │   │   ├── StatsHUD.jsx
│   │   │   ├── QuestionProgressRow.jsx
│   │   │   ├── QuestionCard.jsx             # Supports optional inline ShapeRenderer slot
│   │   │   ├── AnswerButtonGrid.jsx         # Supports text OR shape-icon button content
│   │   │   └── WorldCompleteModal.jsx
│   │   ├── reflect/
│   │   │   ├── ReflectPromptCard.jsx
│   │   │   ├── ReflectChatThread.jsx
│   │   │   └── CompletionSummary.jsx
│   │   └── shared/
│   │       ├── Mascot.jsx
│   │       ├── SpeechBubble.jsx
│   │       ├── HintPill.jsx
│   │       ├── PrimaryGoldButton.jsx
│   │       ├── SecondaryDarkButton.jsx
│   │       ├── ShapeRenderer.jsx            # *** CORE NEW COMPONENT — see §13 ***
│   │       ├── ShapeTile.jsx                # Wraps ShapeRenderer in a bordered tile (for grids/options)
│   │       ├── VertexDragHandle.jsx         # Draggable control point for Shape Builder station
│   │       ├── TapCounterTrack.jsx          # Discrete dash-fill progress track (replaces Slider for counting)
│   │       ├── ParticleBackground.jsx
│   │       └── LockIcon.jsx
│   ├── data/
│   │   ├── questionBank.js              # All 100 question objects
│   │   ├── storyContent.js              # 4 story slide objects
│   │   ├── worldMap.js                  # 10 world definition objects
│   │   └── simulateContent.js           # Station titles/instructions/tips
│   ├── hooks/
│   │   ├── useAudio.js
│   │   ├── useGameState.js
│   │   ├── useLocalStorage.js
│   │   └── usePhaseRouter.js
│   └── utils/
│       ├── shuffle.js
│       ├── scoring.js
│       ├── badgeEngine.js
│       ├── colorTokens.js
│       └── shapeGeometry.js             # *** Parametric shape-point generator — see §13.1 ***
├── scripts/
│   ├── generate_audio.js
│   └── clean_audio.js
├── api/
│   └── elevenlabs.js
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```javascript
const initialState = {
  // Navigation
  phase: 'landing', // 'landing' | 'wonder' | 'story' | 'simulate' | 'play_select' | 'play_quiz' | 'reflect' | 'results'
  route: '/',

  // Story phase
  storySlideIndex: 0, // 0-3 (4 slides)

  // Simulate phase
  currentSimStation: 0, // 0=ShapeBuilder, 1=SideCornerCounter, 2=ShapeSorter, 3=MysteryShape
  simStationsComplete: [false, false, false, false],
  simStationState: {
    shapeBuilder: { shapeType: 'square', vertices: defaultSquareVertices(), detectedShape: 'square' },
    sideCornerCounter: { currentShape: 'triangle', sidesTapped: 0, cornersTapped: 0, totalSides: 3, totalCorners: 3 },
    shapeSorter: { binAssignments: {}, shapesRemaining: 8 },
    mysteryShape: { currentClueIndex: 0, revealed: false },
  },

  // Play phase
  questionSet: [],          // 100 shuffled question objects, grouped into 10 worlds of 10
  currentWorldIndex: 0,     // 0-9
  currentQuestionInWorld: 0,// 0-9
  worldScores: Array(10).fill(null),
  worldUnlocked: [true, false, false, false, false, false, false, false, false, false],
  hintsUsed: 0,
  attemptCount: 0,
  lives: 3,
  selectedAnswerIndex: null,
  answerRevealed: false,

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  streakMultiplier: 1,
  badges: [],

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,
  musicEnabled: false,
};
```

### 4.2 Reducer Actions

```javascript
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NAVIGATE_HOME: 'NAVIGATE_HOME',
  NEXT_SLIDE: 'NEXT_SLIDE',
  PREV_SLIDE: 'PREV_SLIDE',
  SET_SIM_STATION: 'SET_SIM_STATION',
  UPDATE_SHAPE_BUILDER: 'UPDATE_SHAPE_BUILDER',
  TAP_SIDE: 'TAP_SIDE',
  TAP_CORNER: 'TAP_CORNER',
  ASSIGN_BIN: 'ASSIGN_BIN',
  REVEAL_MYSTERY_CLUE: 'REVEAL_MYSTERY_CLUE',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  LOAD_QUESTIONS: 'LOAD_QUESTIONS',
  SELECT_WORLD: 'SELECT_WORLD',
  SELECT_ANSWER: 'SELECT_ANSWER',
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  REVEAL_ANSWER: 'REVEAL_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  COMPLETE_WORLD: 'COMPLETE_WORLD',
  UNLOCK_WORLD: 'UNLOCK_WORLD',
  RESET_LIVES: 'RESET_LIVES',
  RETRY_WORLD: 'RETRY_WORLD',
  ADD_XP: 'ADD_XP',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic Excerpts

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'TAP_SIDE': {
      const newCount = Math.min(state.simStationState.sideCornerCounter.totalSides,
        state.simStationState.sideCornerCounter.sidesTapped + 1);
      return {
        ...state,
        simStationState: {
          ...state.simStationState,
          sideCornerCounter: { ...state.simStationState.sideCornerCounter, sidesTapped: newCount },
        },
      };
    }
    case 'ANSWER_CORRECT': {
      const newStreak = state.streak + 1;
      const newMultiplier = newStreak >= 10 ? 3 : newStreak >= 5 ? 2 : 1;
      const xpGain = calcXP(state.attemptCount + 1, state.hintsUsed, newStreak);
      return {
        ...state,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        streakMultiplier: newMultiplier,
        xp: state.xp + xpGain,
      };
    }
    case 'ANSWER_INCORRECT': {
      const newLives = Math.max(0, state.lives - 1);
      return {
        ...state,
        streak: 0,
        streakMultiplier: 1,
        lives: newLives,
        attemptCount: state.attemptCount + 1,
      };
    }
    case 'COMPLETE_WORLD': {
      const { worldIndex, correctCount } = action.payload;
      const newScores = [...state.worldScores];
      newScores[worldIndex] = correctCount;
      const stars = calcStars(correctCount);
      const canUnlockNext = canUnlockWorld(correctCount);
      const newUnlocked = [...state.worldUnlocked];
      if (canUnlockNext && worldIndex + 1 < 10) newUnlocked[worldIndex + 1] = true;
      return {
        ...state,
        worldScores: newScores,
        worldUnlocked: newUnlocked,
        totalStars: state.totalStars + stars,
      };
    }
    default:
      return state;
  }
}
```

---

## 5. Component Specifications — Chrome (Shared Navigation Shell)

(Identical anatomy/CSS to the established reference-parity pattern; included here for completeness since this TRD must stand alone.)

### 5.1 `PhaseTracker.jsx`

```jsx
const PHASES = [
  { key: 'wonder',   num: '01', icon: '🔍', label: 'Wonder' },
  { key: 'story',    num: '02', icon: '📖', label: 'Story' },
  { key: 'simulate', num: '03', icon: '✏️', label: 'Simulate' },
  { key: 'play',     num: '04', icon: '🎮', label: 'Play' },
  { key: 'reflect',  num: '05', icon: '📋', label: 'Reflect' },
];

function PhaseTracker({ currentPhase, phaseComplete }) {
  return (
    <nav className="phase-tracker">
      {PHASES.map((p) => {
        const isComplete = phaseComplete[p.key];
        const isActive = currentPhase === p.key;
        return (
          <PhaseSegment
            key={p.key}
            number={p.num}
            icon={p.icon}
            label={p.label}
            state={isActive ? 'active' : isComplete ? 'complete' : 'future'}
          />
        );
      })}
    </nav>
  );
}
```

```css
.phase-tracker {
  display: flex; align-items: center; gap: 4px;
  background: var(--surface-pill-dark);
  border-radius: 999px; padding: 6px 10px;
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
  z-index: 50;
}
.phase-segment {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px;
  font-weight: 700; font-size: 14px;
  color: var(--text-muted-lavender);
  transition: all 0.2s ease;
}
.phase-segment--active {
  background: var(--surface-pill-active);
  color: var(--accent-gold);
  box-shadow: 0 0 0 1px rgba(245, 184, 46, 0.25);
}
.phase-segment--complete { color: var(--accent-success-green); }
.phase-segment--complete::after { content: " ✓"; }
```

### 5.2 `HomePill.jsx` / `AudioToggleFAB.jsx`

```jsx
function HomePill({ onNavigateHome }) {
  return (
    <button className="home-pill" onClick={onNavigateHome}>
      <span>🏠</span><span>Home</span>
    </button>
  );
}

function AudioToggleFAB({ audioEnabled, onToggle }) {
  return (
    <button className="audio-fab" onClick={onToggle} aria-label="Toggle narration">
      {audioEnabled ? <SpeakerIcon /> : <SpeakerMutedIcon />}
    </button>
  );
}
```

```css
.home-pill {
  position: fixed; top: 20px; left: 24px;
  background: var(--surface-pill-darkest); color: var(--accent-gold);
  font-weight: 700; border-radius: 999px; padding: 10px 18px;
  display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; z-index: 50;
}
.audio-fab {
  position: fixed; bottom: 24px; right: 24px;
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--accent-gold);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35); border: none; cursor: pointer; z-index: 50;
}
```

---

## 6. Design Token System (CSS Custom Properties)

```css
:root {
  /* Backgrounds */
  --bg-base: #1B1442;
  --bg-base-glow: #2A1F5E;

  /* Surfaces */
  --surface-card: #271D5C;
  --surface-card-elevated: #2E2270;
  --surface-card-nested: #332868;
  --surface-pill-dark: #241B47;
  --surface-pill-active: #423269;
  --surface-pill-darkest: #150F38;

  /* Accents */
  --accent-gold: #F5B82E;
  --accent-gold-deep: #F0A830;
  --accent-success-green: #3DBA6E;
  --accent-alert-coral: #E0556B;
  --accent-purple-badge: #7B5CC9;
  --accent-heart-pink: #EC4D78;

  /* Shape identity tokens (NEW for this module — semantically separate from UI accents) */
  --shape-square-fill: #5B8DEF;
  --shape-rectangle-fill: #3DBA6E;
  --shape-triangle-fill: #F5B82E;
  --shape-circle-fill: #E0556B;
  --shape-stroke: #FFFFFF;

  /* Text */
  --text-primary: #FFFFFF;
  --text-muted-lavender: #A89FC9;
  --text-locked-gray: #7A7396;

  /* Radii */
  --radius-pill: 999px;
  --radius-card: 24px;
  --radius-card-sm: 16px;
  --radius-hint: 12px;

  /* Shadows */
  --shadow-card: 0 8px 24px rgba(0,0,0,0.28);
  --shadow-gold-glow: 0 6px 20px rgba(245,184,46,0.45);

  /* Typography */
  --font-display: 'Fredoka One', 'Nunito', sans-serif;
  --font-body: 'Nunito', sans-serif;
}

body {
  background: radial-gradient(ellipse at 50% 0%, var(--bg-base-glow) 0%, var(--bg-base) 65%);
  font-family: var(--font-body);
  color: var(--text-primary);
  min-height: 100vh;
}
```

> **Build instruction:** before locking these as final, inspect `intellia-substraction.vercel.app`'s computed styles directly via browser DevTools to capture exact production values. The hex values above are derived from screenshot pixel-sampling and are accurate to within normal visual-matching tolerance.

---

## 7. Component Specifications — Landing Screen

```jsx
function LandingRoute() {
  return (
    <div className="landing-screen">
      <ParticleBackground />
      <LandingCard>
        <CurriculumBadge text="Singapore MOE Curriculum · Grade 2" />
        <LessonTitle lineWhite="Exploring 2D" lineGold="Shapes!" />
        <MascotGreetingRow mood="happy" text="Ready to go shape-spotting? Let's go!" />
        <p className="landing-description">
          Join Pip the Penguin and discover the secrets of squares,
          rectangles, triangles, and circles — through stories,
          simulations, and exciting games!
        </p>
        <JourneyMapPanel phases={['Wonder', 'Story', 'Simulate', 'Play', 'Reflect']} />
        <BeginJourneyButton onClick={() => navigateTo('wonder')} />
        <FeatureCardRow items={[
          { icon: '🔺', label: '4 Shapes to Master' },
          { icon: '✏️', label: '4 Simulations' },
          { icon: '🎮', label: '10 Shape Worlds' },
        ]} />
      </LandingCard>
    </div>
  );
}
```

```css
.landing-card {
  max-width: 620px; margin: 60px auto;
  background: var(--surface-card); border-radius: var(--radius-card);
  padding: 40px 48px; box-shadow: var(--shadow-card); text-align: center;
}
.lesson-title { font-family: var(--font-display); font-size: 42px; line-height: 1.15; font-weight: 800; }
.lesson-title__white { color: var(--text-primary); display: block; }
.lesson-title__gold { color: var(--accent-gold); display: block; }

.journey-map-panel {
  background: var(--surface-card-elevated); border-radius: var(--radius-card-sm);
  padding: 20px 24px; margin: 28px 0;
}
.journey-map-panel__label {
  font-size: 12px; letter-spacing: 0.08em; font-weight: 800;
  color: var(--accent-gold); text-transform: uppercase; margin-bottom: 12px;
}
.journey-chip { background: var(--surface-pill-active); border-radius: var(--radius-pill); padding: 8px 16px; font-weight: 700; font-size: 14px; }

.begin-journey-btn {
  background: linear-gradient(180deg, var(--accent-gold) 0%, var(--accent-gold-deep) 100%);
  color: #2A1F00; font-weight: 800; font-size: 17px;
  border-radius: var(--radius-pill); padding: 16px 36px; border: none;
  box-shadow: var(--shadow-gold-glow); cursor: pointer;
}

.feature-card-row { display: flex; gap: 16px; margin-top: 28px; }
.feature-card { flex: 1; background: var(--surface-card-nested); border-radius: var(--radius-card-sm); padding: 18px 12px; text-align: center; }
.feature-card__icon { font-size: 26px; margin-bottom: 8px; }
.feature-card__label { font-size: 13px; color: var(--text-muted-lavender); font-weight: 600; }
```

---

## 8. Component Specifications — Wonder Phase

```jsx
function WonderRoute({ onInvestigate }) {
  const { audioEnabled } = useGameState();
  useEffect(() => {
    if (audioEnabled) narrate(wonderNarration());
    return () => stopNarration();
  }, [audioEnabled]);

  return (
    <div className="phase-screen">
      <MascotGreetingRow mood="curious" text="Hmm... I wonder..." />
      <div className="wonder-icon-badge">
        <ShapeRenderer type="square" size={32} rotation={15} fillToken="--shape-square-fill" />
        <ShapeRenderer type="circle" size={28} fillToken="--shape-circle-fill" style={{ marginLeft: -8 }} />
      </div>
      <div className="content-card">
        <h1 className="wonder-headline">
          A window grille has 4 straight sides and 4 corners that look
          exactly the same. A clock on the wall has no corners at all.
          What shapes are they?
        </h1>
        <p className="wonder-subquestion">
          What if we counted the sides and corners to find out?
        </p>
        <HintPill text="We could count the sides and corners to be sure!" />
      </div>
      <PrimaryGoldButton icon="🔍" label="Let's Investigate!" onClick={onInvestigate} />
    </div>
  );
}
```

```css
.wonder-icon-badge {
  width: 104px; height: 104px; border-radius: 50%;
  background: rgba(123, 92, 201, 0.35);
  display: flex; align-items: center; justify-content: center;
  margin: 32px auto;
}
.content-card {
  background: var(--surface-card); border-radius: var(--radius-card);
  padding: 40px; max-width: 680px; margin: 0 auto; text-align: center;
}
.wonder-headline { font-size: 28px; font-weight: 800; line-height: 1.35; color: var(--text-primary); margin-bottom: 16px; }
.wonder-subquestion { font-style: italic; font-size: 16px; color: var(--text-muted-lavender); margin-bottom: 24px; }
.hint-pill { background: var(--surface-card-nested); border-radius: var(--radius-hint); padding: 14px 20px; font-weight: 700; color: var(--accent-gold); display: inline-block; }
```

---

## 9. Component Specifications — Story Phase

```jsx
const STORY_SLIDES = [
  {
    title: "Pip's Shape Hunt",
    illustration: '/images/story-bg-playground-1.svg',
    body: "Pip the Penguin loves the playground. Today, Pip notices something interesting — every single thing here is built from just four simple shapes!",
    fact: '4 Shapes Everywhere!',
    mascotNudge: "Let's look closely at each one together!",
  },
  {
    title: 'Counting Sides and Corners',
    illustration: '/images/story-bg-playground-2.svg',
    body: "The climbing frame is a square. It has 4 sides that are all the same length, and 4 corners that look exactly the same.",
    fact: 'Square: 4 sides, 4 equal corners',
    mascotNudge: "A square's sides are always equal — that's its secret!",
  },
  {
    title: 'The Round Roundabout',
    illustration: '/images/story-bg-playground-3.svg',
    body: "The roundabout is round all the way around — it's a circle! A circle has no straight sides and no corners at all, just one smooth curve.",
    fact: 'Circle: 0 sides, 0 corners',
    mascotNudge: 'No corners to bump into on a circle!',
  },
  {
    title: 'Triangle Flag and Rectangle Bench',
    illustration: '/images/story-bg-playground-4.svg',
    body: "The flag is a triangle with 3 straight sides and 3 corners. The bench is a rectangle with 4 straight sides — but only the opposite sides match in length!",
    fact: 'Triangle: 3 sides · Rectangle: 4 sides',
    mascotNudge: 'Now you know all four shapes — let\'s go practice!',
  },
];

function StoryRoute() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = STORY_SLIDES[slideIndex];
  const total = STORY_SLIDES.length;
  const pct = Math.round(((slideIndex + 1) / total) * 100);

  useEffect(() => {
    if (audioEnabled) narrate(getStoryNarration(slideIndex));
    return () => stopNarration();
  }, [slideIndex, audioEnabled]);

  return (
    <div className="phase-screen">
      <SlideProgressRow current={slideIndex + 1} total={total} percent={pct} />
      <div className="content-card story-card">
        <img src={slide.illustration} alt={slide.title} className="story-illustration" />
        <h2 className="story-title">{slide.title}</h2>
        <p className="story-body">{slide.body}</p>
        <HintPill text={slide.fact} />
        <MascotGreetingRow mood="happy" text={slide.mascotNudge} small />
      </div>
      <SecondaryDarkButton
        label={slideIndex === total - 1 ? 'Continue ->' : 'Next ->'}
        onClick={() => {
          if (slideIndex < total - 1) setSlideIndex(slideIndex + 1);
          else transitionTo('simulate');
        }}
      />
    </div>
  );
}
```

```css
.slide-progress-row { display: flex; justify-content: space-between; align-items: center; max-width: 680px; margin: 0 auto 8px; font-size: 13px; color: var(--text-muted-lavender); }
.slide-progress-dots { display: flex; gap: 6px; }
.slide-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--surface-pill-active); }
.slide-dot--current { width: 24px; border-radius: 999px; background: var(--accent-gold); }
.story-illustration { width: 100%; border-radius: var(--radius-card-sm); margin-bottom: 20px; display: block; }
.story-title { color: var(--accent-gold); font-weight: 800; font-size: 22px; margin-bottom: 10px; text-align: left; }
.story-body { text-align: left; font-size: 16px; line-height: 1.6; margin-bottom: 18px; }
```

---

## 10. Component Specifications — Simulate Phase

### 10.1 Station Tab Bar

```jsx
const STATIONS = [
  { letter: 'A', color: 'purple', icon: '🔷', label: 'Shape Builder' },
  { letter: 'B', color: 'green',  icon: '👆', label: 'Side & Corner Counter' },
  { letter: 'C', color: 'gold',   icon: '🗳️', label: 'Shape Sorter' },
  { letter: 'D', color: 'orange', icon: '🔎', label: 'Mystery Shape' },
];

function StationTabBar({ activeIndex, onSelect }) {
  return (
    <div className="station-tab-bar">
      {STATIONS.map((s, i) => (
        <button key={s.letter} className={`station-tab ${i === activeIndex ? 'station-tab--active' : ''}`} onClick={() => onSelect(i)}>
          <span className={`station-tab__badge station-tab__badge--${s.color}`}>{s.letter}</span>
          <span className="station-tab__icon">{s.icon}</span>
          <span className="station-tab__label">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
```

```css
.station-tab-bar { display: flex; gap: 10px; justify-content: center; margin: 20px 0; flex-wrap: wrap; }
.station-tab { display: flex; align-items: center; gap: 8px; background: var(--surface-pill-dark); border-radius: 14px; padding: 10px 16px; border: none; color: var(--text-primary); cursor: pointer; }
.station-tab--active { background: var(--accent-gold); color: #2A1F00; }
.station-tab__badge { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: white; }
.station-tab__badge--purple { background: var(--accent-purple-badge); }
.station-tab__badge--green  { background: var(--accent-success-green); }
.station-tab__badge--gold   { background: var(--accent-gold-deep); }
.station-tab__badge--orange { background: #E8893B; }
```

### 10.2 Station A — Shape Builder (Concrete)

```jsx
function ShapeBuilderStation() {
  const [vertices, setVertices] = useState(defaultSquareVertices());
  const detectedShape = useMemo(() => classifyShapeFromVertices(vertices), [vertices]);

  const handleVertexDrag = (index, newPos) => {
    const updated = [...vertices];
    updated[index] = newPos;
    setVertices(updated);
  };

  return (
    <div className="content-card">
      <h3 className="station-title">🔷 Shape Builder</h3>
      <p className="station-instruction">Drag the corners — watch the shape change live!</p>

      <div className="shape-builder-canvas">
        <ShapeRenderer vertices={vertices} interactive onVertexDrag={handleVertexDrag} fillToken={shapeFillToken(detectedShape)} />
      </div>

      <div className="feedback-panel">
        <p className="feedback-equation">
          This shape has <strong>{vertices.length}</strong> sides and is currently a{' '}
          <strong style={{ color: `var(${shapeFillToken(detectedShape)})` }}>{detectedShape}</strong>.
        </p>
      </div>

      <StatusBanner variant="success" text="✨ Try dragging a corner to make a triangle!" />
      <div className="station-actions">
        <SecondaryDarkButton label="Reset Shape" onClick={() => setVertices(defaultSquareVertices())} />
        <SecondaryDarkButton label="New Shape" onClick={() => setVertices(randomPresetVertices())} />
      </div>
    </div>
  );
}
```

### 10.3 Station B — Side & Corner Counter (Pictorial)

```jsx
function SideCornerCounterStation() {
  const [shape, setShape] = useState(() => randomShapeSpec());
  const [sidesTapped, setSidesTapped] = useState(new Set());
  const [cornersTapped, setCornersTapped] = useState(new Set());

  const allSidesCounted = sidesTapped.size === shape.sideCount;
  const allCornersCounted = cornersTapped.size === shape.cornerCount;
  const classification = allSidesCounted && allCornersCounted ? classifyBySidesCorners(shape.sideCount, shape.cornerCount) : null;

  return (
    <div className="content-card">
      <h3 className="station-title">👆 Side &amp; Corner Counter</h3>
      <p className="station-instruction">Tap every side, then every corner!</p>

      <div className="operand-row">
        <div className="operand operand--gold">
          <span className="operand__label">SIDES</span>
          <span className="operand__value">{sidesTapped.size}</span>
        </div>
        <div className="operand operand--purple">
          <span className="operand__label">CORNERS</span>
          <span className="operand__value">{cornersTapped.size}</span>
        </div>
      </div>

      <TapCounterTrack label={`Sides counted: ${sidesTapped.size} of ${shape.sideCount}`} filled={sidesTapped.size} total={shape.sideCount} />
      <TapCounterTrack label={`Corners counted: ${cornersTapped.size} of ${shape.cornerCount}`} filled={cornersTapped.size} total={shape.cornerCount} />

      <div className="feedback-panel">
        <ShapeRenderer
          shapeSpec={shape}
          tappableSides
          tappableCorners
          highlightedSides={sidesTapped}
          highlightedCorners={cornersTapped}
          onSideTap={(i) => setSidesTapped(new Set(sidesTapped).add(i))}
          onCornerTap={(i) => setCornersTapped(new Set(cornersTapped).add(i))}
        />
        {classification && (
          <p className="feedback-equation">
            {shape.sideCount} sides + {shape.cornerCount} corners = this is a <strong>{classification}</strong>!
          </p>
        )}
      </div>

      <SecondaryDarkButton label="New Shape" onClick={() => {
        setShape(randomShapeSpec());
        setSidesTapped(new Set());
        setCornersTapped(new Set());
      }} />
    </div>
  );
}
```

```css
.shape-builder-canvas { width: 100%; height: 280px; display: flex; align-items: center; justify-content: center; }
.operand-row { display: flex; align-items: center; justify-content: center; gap: 24px; margin: 20px 0; }
.operand { text-align: center; }
.operand__label { display: block; font-size: 11px; letter-spacing: 0.06em; color: var(--text-muted-lavender); margin-bottom: 4px; }
.operand__value { font-size: 40px; font-weight: 800; }
.operand--gold .operand__value { color: var(--accent-gold); }
.operand--purple .operand__value { color: var(--accent-purple-badge); }

.feedback-panel { background: var(--surface-card-nested); border-radius: var(--radius-card-sm); padding: 24px; text-align: center; margin: 20px 0; }
.feedback-equation { font-size: 18px; font-weight: 700; margin-top: 16px; }

.status-banner { border-radius: var(--radius-card-sm); padding: 14px 20px; font-weight: 700; text-align: center; margin-bottom: 16px; }
.status-banner--warning { background: rgba(224, 85, 107, 0.18); color: var(--accent-alert-coral); }
.status-banner--success { background: rgba(61, 186, 110, 0.18); color: var(--accent-success-green); }
```

### 10.4 `TapCounterTrack.jsx` (replaces `Slider.jsx` for this module's discrete-counting station)

```jsx
function TapCounterTrack({ label, filled, total }) {
  const pct = (filled / total) * 100;
  return (
    <div className="tap-counter">
      <label className="tap-counter__label">{label}</label>
      <div className="tap-counter__track">
        <div className="tap-counter__fill" style={{ width: `${pct}%` }} />
        {Array(total).fill(0).map((_, i) => (
          <span key={i} className={`tap-counter__tick ${i < filled ? 'is-filled' : ''}`} />
        ))}
      </div>
    </div>
  );
}
```

```css
.tap-counter { margin: 12px 0; }
.tap-counter__label { font-size: 13px; color: var(--text-muted-lavender); display: block; margin-bottom: 6px; }
.tap-counter__track { position: relative; height: 10px; border-radius: 999px; background: var(--surface-card-nested); overflow: hidden; }
.tap-counter__fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--accent-gold); transition: width 0.3s ease; }
```

### 10.5 Station C — Shape Sorter (Pictorial->Abstract)

```jsx
function ShapeSorterStation() {
  const [pool, setPool] = useState(() => generateSortingPool(8)); // 8 mixed shape tiles
  const [bins, setBins] = useState({ square: [], rectangle: [], triangle: [], circle: [] });

  const handleDrop = (shapeId, binName) => {
    const shape = pool.find((s) => s.id === shapeId);
    if (shape.type !== binName) {
      // Incorrect bin — bounce shape back, play 'wrong' SFX, no penalty (Simulate phase has no wrong answers)
      return;
    }
    setBins({ ...bins, [binName]: [...bins[binName], shape] });
    setPool(pool.filter((s) => s.id !== shapeId));
  };

  return (
    <div className="content-card">
      <h3 className="station-title">🗳️ Shape Sorter</h3>
      <p className="station-instruction">Drag each shape into its matching bin!</p>

      <div className="sorter-pool">
        {pool.map((s) => (
          <ShapeTile key={s.id} shapeSpec={s} draggable onDragStart={(e) => e.dataTransfer.setData('shapeId', s.id)} />
        ))}
      </div>

      <div className="sorter-bins">
        {['square', 'rectangle', 'triangle', 'circle'].map((binName) => (
          <div
            key={binName}
            className="sorter-bin"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e.dataTransfer.getData('shapeId'), binName)}
          >
            <span className="sorter-bin__label">{capitalize(binName)}</span>
            <div className="sorter-bin__contents">
              {bins[binName].map((s) => <ShapeTile key={s.id} shapeSpec={s} small />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 10.6 Station D — Mystery Shape (Abstract)

```jsx
const MYSTERY_CLUES = [
  { clue: "I have 3 straight sides and 3 corners. What shape am I?", answer: 'triangle' },
  { clue: "I have no straight sides and no corners at all. What shape am I?", answer: 'circle' },
  { clue: "I have 4 sides that are all exactly the same length. What shape am I?", answer: 'square' },
  { clue: "I have 4 straight sides, but only my opposite sides match in length. What shape am I?", answer: 'rectangle' },
];

function MysteryShapeStation() {
  const [clueIndex, setClueIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const clue = MYSTERY_CLUES[clueIndex];

  return (
    <div className="content-card">
      <h3 className="station-title">🔎 Mystery Shape</h3>
      <p className="station-instruction">Read the clue and pick the matching shape!</p>

      <div className="feedback-panel">
        <p className="mystery-clue">"{clue.clue}"</p>
      </div>

      <div className="answer-grid">
        {['square', 'rectangle', 'triangle', 'circle'].map((type) => (
          <button
            key={type}
            className={`answer-btn shape-answer-btn ${revealed && type === clue.answer ? 'answer-btn--correct' : ''}`}
            onClick={() => setRevealed(true)}
          >
            <ShapeRenderer type={type} size={48} fillToken={shapeFillToken(type)} />
          </button>
        ))}
      </div>

      <SecondaryDarkButton label="Next Mystery" onClick={() => {
        setClueIndex((clueIndex + 1) % MYSTERY_CLUES.length);
        setRevealed(false);
      }} />
    </div>
  );
}
```

---

## 11. Component Specifications — Play Phase

### 11.1 `WorldCard.jsx`

```jsx
function WorldCard({ world, state, onPlay }) {
  return (
    <div className={`world-card world-card--${state}`}>
      <div className={`world-card__icon world-card__icon--${state === 'locked' ? 'locked' : world.color}`}>
        {state === 'locked' ? <LockIcon /> : <span>{world.emoji}</span>}
      </div>
      <div className="world-card__info">
        <h3 className={`world-card__name ${state === 'locked' ? 'is-muted' : ''}`}>{world.name}</h3>
        <p className="world-card__desc">{world.descriptor}</p>
      </div>
      {state === 'unlocked' && <button className="world-card__play-btn" onClick={onPlay}>▶ PLAY</button>}
      {state === 'completed' && (
        <div className="world-card__stars">
          <StarRating count={world.starsEarned} />
          <button className="world-card__play-btn world-card__play-btn--secondary" onClick={onPlay}>REPLAY</button>
        </div>
      )}
    </div>
  );
}
```

```css
.world-card { display: flex; align-items: center; gap: 16px; background: var(--surface-pill-dark); border-radius: 18px; padding: 18px 22px; margin-bottom: 14px; }
.world-card__icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.world-card__icon--locked { background: rgba(224, 85, 107, 0.25); color: var(--accent-alert-coral); }
.world-card__icon--blue { background: #3D7DD9; }
.world-card__info { flex: 1; }
.world-card__name { font-size: 17px; font-weight: 800; color: var(--text-primary); }
.world-card__name.is-muted { color: var(--text-locked-gray); }
.world-card__desc { font-size: 13px; color: var(--text-muted-lavender); }
.world-card__play-btn { background: var(--accent-success-green); color: white; font-weight: 800; border-radius: 999px; padding: 10px 22px; border: none; cursor: pointer; }
```

### 11.2 `QuestionCard.jsx` (extended to support inline shape renders)

```jsx
function QuestionCard({ question }) {
  return (
    <div className="content-card question-card">
      <h2 className="question-text">{question.questionText}</h2>
      {question.visualShape && (
        <div className="question-shape-slot">
          <ShapeRenderer shapeSpec={question.visualShape} size={120} />
        </div>
      )}
      {question.visualShapeSet && (
        <div className="question-shape-set">
          {question.visualShapeSet.map((s, i) => (
            <ShapeRenderer key={i} shapeSpec={s} size={64} />
          ))}
        </div>
      )}
      <AnswerButtonGrid
        options={question.options}
        optionType={question.optionType} // 'text' | 'shape'
        onSelect={handleSelect}
        selectedIndex={selectedAnswerIndex}
        correctIndex={question.correctIndex}
        revealed={answerRevealed}
      />
    </div>
  );
}
```

```css
.question-shape-slot { display: flex; justify-content: center; margin: 20px 0; }
.question-shape-set { display: flex; justify-content: center; gap: 16px; margin: 20px 0; flex-wrap: wrap; }
```

### 11.3 `AnswerButtonGrid.jsx` (extended for shape-icon button content)

```jsx
function AnswerButtonGrid({ options, optionType, onSelect, selectedIndex, correctIndex, revealed }) {
  return (
    <div className="answer-grid">
      {options.map((opt, i) => {
        let stateClass = '';
        if (revealed) {
          if (i === correctIndex) stateClass = 'answer-btn--correct';
          else if (i === selectedIndex) stateClass = 'answer-btn--incorrect';
        }
        return (
          <button key={i} className={`answer-btn ${stateClass}`} onClick={() => onSelect(i)} disabled={revealed}>
            {optionType === 'shape'
              ? <ShapeRenderer shapeSpec={opt} size={48} />
              : opt}
          </button>
        );
      })}
    </div>
  );
}
```

```css
.answer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
.answer-btn {
  background: var(--surface-card-nested); border-radius: 16px; padding: 28px;
  font-size: 26px; font-weight: 800; color: var(--text-primary);
  border: none; cursor: pointer; transition: transform 0.15s ease, background 0.2s ease;
  display: flex; align-items: center; justify-content: center;
}
.answer-btn--correct { background: var(--accent-success-green); animation: bounceIn 0.4s ease; }
.answer-btn--incorrect { background: var(--accent-alert-coral); animation: shake 0.4s ease; }
```

### 11.4 `StatsHUD.jsx`

```jsx
function StatsHUD({ stars, lives, maxLives, streakMultiplier }) {
  return (
    <div className="stats-hud">
      <div className="stats-hud__zone"><span>⭐</span><span>{stars}</span></div>
      <div className="stats-hud__zone stats-hud__zone--center">
        {Array(maxLives).fill(0).map((_, i) => (
          <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
        ))}
      </div>
      <div className="stats-hud__zone"><span>🔥</span><span>{streakMultiplier}x</span></div>
    </div>
  );
}
```

```css
.stats-hud { display: flex; justify-content: space-between; align-items: center; background: var(--surface-pill-dark); border-radius: var(--radius-card-sm); padding: 14px 24px; max-width: 680px; margin: 0 auto 16px; }
.stats-hud__zone { display: flex; align-items: center; gap: 6px; font-weight: 800; }
```

---

## 12. Question Data Model

### 12.1 Schema

```typescript
interface ShapeSpec {
  type: 'square' | 'rectangle' | 'triangle' | 'circle';
  sideCount: 4 | 4 | 3 | 0;
  cornerCount: 4 | 4 | 3 | 0;
  rotation: number;       // degrees, 0-359
  scale: number;           // relative size multiplier, 0.6-1.4
  aspectRatio?: number;    // for rectangle only, width/height ratio != 1
  fillToken: string;       // CSS var name, e.g. '--shape-square-fill'
}

interface Question {
  id: string;
  type: QuestionType;
  world: number;             // 0-9
  difficulty: 1 | 2 | 3;
  questionText: string;
  visualShape?: ShapeSpec;          // single shape render slot
  visualShapeSet?: ShapeSpec[];     // multi-shape render slot (Q6, Q9, Q10)
  optionType: 'text' | 'shape';
  options: (string | ShapeSpec)[];  // always length 4
  hint1: string;
  hint2: string;
  explanation: string;
  objectName?: string;              // for Q7 real-world-object questions
  correctAnswer: string | boolean;
  correctIndex: number;
}

type QuestionType =
  | 'name_shape' | 'count_sides' | 'count_corners' | 'attribute_to_shape'
  | 'true_false_attribute' | 'odd_one_out' | 'real_world_match'
  | 'square_vs_rectangle' | 'sort_classify' | 'pattern_reasoning';
```

### 12.2 Sample Objects

```javascript
{
  id: "Q1_001", type: "name_shape", world: 0, difficulty: 1,
  questionText: "What shape is this?",
  visualShape: { type: 'triangle', sideCount: 3, cornerCount: 3, rotation: 0, scale: 1, fillToken: '--shape-triangle-fill' },
  optionType: 'text',
  options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
  hint1: "Count the sides — how many straight edges does it have?",
  hint2: "It has 3 sides and 3 corners.",
  explanation: "This shape has 3 straight sides and 3 corners, so it's a Triangle.",
  correctAnswer: 'Triangle', correctIndex: 1,
}

{
  id: "Q4_015", type: "attribute_to_shape", world: 3, difficulty: 2,
  questionText: "I have 4 straight sides, but only my opposite sides are the same length. What shape am I?",
  optionType: 'shape',
  options: [
    { type: 'square', sideCount: 4, cornerCount: 4, rotation: 0, scale: 1, fillToken: '--shape-square-fill' },
    { type: 'rectangle', sideCount: 4, cornerCount: 4, rotation: 0, scale: 1, aspectRatio: 1.6, fillToken: '--shape-rectangle-fill' },
    { type: 'triangle', sideCount: 3, cornerCount: 3, rotation: 0, scale: 1, fillToken: '--shape-triangle-fill' },
    { type: 'circle', sideCount: 0, cornerCount: 0, rotation: 0, scale: 1, fillToken: '--shape-circle-fill' },
  ],
  hint1: "A square's sides are ALL the same. Look for a shape where only opposite sides match.",
  hint2: "This shape looks longer than it is tall (or taller than it is long).",
  explanation: "A rectangle has 4 sides, but only the opposite pairs are equal — that's the difference from a square.",
  correctAnswer: 'rectangle', correctIndex: 1,
}

{
  id: "Q6_052", type: "odd_one_out", world: 5, difficulty: 2,
  questionText: "Which shape has no straight sides?",
  visualShapeSet: [
    { type: 'square', sideCount: 4, cornerCount: 4, rotation: 0, scale: 1, fillToken: '--shape-square-fill' },
    { type: 'triangle', sideCount: 3, cornerCount: 3, rotation: 0, scale: 1, fillToken: '--shape-triangle-fill' },
    { type: 'circle', sideCount: 0, cornerCount: 0, rotation: 0, scale: 1, fillToken: '--shape-circle-fill' },
    { type: 'rectangle', sideCount: 4, cornerCount: 4, rotation: 0, scale: 1, aspectRatio: 1.5, fillToken: '--shape-rectangle-fill' },
  ],
  optionType: 'text',
  options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
  hint1: "Look for the shape that's perfectly round.",
  hint2: "Three of these shapes have straight edges. One does not.",
  explanation: "A circle has one smooth curved edge and no straight sides at all.",
  correctAnswer: 'Circle', correctIndex: 2,
}
```

---

## 13. Shape Rendering Engine (Core New Subsystem)

### 13.1 `utils/shapeGeometry.js` — Parametric Vertex Generator

```javascript
/**
 * Generates SVG point coordinates for a regular or specified polygon,
 * or a circle, given a shape type, size, rotation, and (for rectangle) aspect ratio.
 * All shapes are generated centered at (0,0) for easy rotation/transform composition.
 */

export function generateShapePoints(spec) {
  const { type, scale = 1, aspectRatio = 1 } = spec;
  const baseRadius = 50 * scale;

  switch (type) {
    case 'square':
      return regularPolygonPoints(4, baseRadius, 45); // 45deg offset so square sits flat, not diamond
    case 'rectangle':
      return rectanglePoints(baseRadius * 2, (baseRadius * 2) / aspectRatio);
    case 'triangle':
      return regularPolygonPoints(3, baseRadius, -90); // point-up orientation
    case 'circle':
      return null; // circles render via <circle>, not <polygon>
    default:
      throw new Error(`Unknown shape type: ${type}`);
  }
}

function regularPolygonPoints(sides, radius, offsetDeg = 0) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (360 / sides) * i + offsetDeg;
    const rad = (angle * Math.PI) / 180;
    points.push({ x: radius * Math.cos(rad), y: radius * Math.sin(rad) });
  }
  return points;
}

function rectanglePoints(width, height) {
  return [
    { x: -width / 2, y: -height / 2 },
    { x: width / 2, y: -height / 2 },
    { x: width / 2, y: height / 2 },
    { x: -width / 2, y: height / 2 },
  ];
}

export function rotatePoints(points, degrees) {
  const rad = (degrees * Math.PI) / 180;
  return points.map(({ x, y }) => ({
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  }));
}

export function pointsToSvgString(points, cx = 60, cy = 60) {
  return points.map((p) => `${p.x + cx},${p.y + cy}`).join(' ');
}

/**
 * Classifies a freeform polygon (from the Shape Builder station's draggable
 * vertices) into the nearest known shape type, for live feedback as the
 * student drags vertices.
 */
export function classifyShapeFromVertices(vertices) {
  const n = vertices.length;
  if (n === 3) return 'triangle';
  if (n !== 4) return 'polygon'; // not a target shape — Shape Builder station constrains to 3 or 4 vertices in v1.0
  const sideLengths = sideLengthsOf(vertices);
  const allEqual = sideLengths.every((len) => Math.abs(len - sideLengths[0]) < 4); // tolerance in px
  const anglesAreRight = anglesApproxRight(vertices, 8); // tolerance in degrees
  if (!anglesAreRight) return 'quadrilateral'; // not axis-aligned enough to call square/rectangle
  return allEqual ? 'square' : 'rectangle';
}

function sideLengthsOf(points) {
  return points.map((p, i) => {
    const next = points[(i + 1) % points.length];
    return Math.hypot(next.x - p.x, next.y - p.y);
  });
}

function anglesApproxRight(points, toleranceDeg) {
  return points.every((p, i) => {
    const prev = points[(i - 1 + points.length) % points.length];
    const next = points[(i + 1) % points.length];
    const v1 = { x: prev.x - p.x, y: prev.y - p.y };
    const v2 = { x: next.x - p.x, y: next.y - p.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);
    const angleDeg = (Math.acos(dot / (mag1 * mag2)) * 180) / Math.PI;
    return Math.abs(angleDeg - 90) < toleranceDeg;
  });
}

export function classifyBySidesCorners(sides, corners) {
  if (sides === 0 && corners === 0) return 'circle';
  if (sides === 3 && corners === 3) return 'triangle';
  if (sides === 4 && corners === 4) return 'square or rectangle'; // station B does not distinguish square/rectangle by count alone — by design, since both have 4/4; the distinguishing UI cue is equal-side highlighting, handled separately
  return 'unknown shape';
}

export function shapeFillToken(type) {
  const map = {
    square: '--shape-square-fill',
    rectangle: '--shape-rectangle-fill',
    triangle: '--shape-triangle-fill',
    circle: '--shape-circle-fill',
  };
  return map[type] || '--shape-square-fill';
}

export function randomShapeSpec(overrides = {}) {
  const types = ['square', 'rectangle', 'triangle', 'circle'];
  const type = overrides.type || types[Math.floor(Math.random() * types.length)];
  const base = {
    square:    { type, sideCount: 4, cornerCount: 4 },
    rectangle: { type, sideCount: 4, cornerCount: 4, aspectRatio: 1.3 + Math.random() * 0.6 },
    triangle:  { type, sideCount: 3, cornerCount: 3 },
    circle:    { type, sideCount: 0, cornerCount: 0 },
  }[type];
  return {
    ...base,
    rotation: Math.floor(Math.random() * 360),
    scale: 0.8 + Math.random() * 0.4,
    fillToken: shapeFillToken(type),
    ...overrides,
  };
}
```

### 13.2 `components/shared/ShapeRenderer.jsx` — The Render Component

```jsx
import { generateShapePoints, rotatePoints, pointsToSvgString } from '../../utils/shapeGeometry';

function ShapeRenderer({
  type, shapeSpec, size = 80, rotation, scale,
  interactive = false, onVertexDrag,
  tappableSides = false, tappableCorners = false,
  highlightedSides = new Set(), highlightedCorners = new Set(),
  onSideTap, onCornerTap,
  fillToken,
}) {
  const spec = shapeSpec || { type, rotation: rotation ?? 0, scale: scale ?? 1, fillToken };
  const fill = `var(${spec.fillToken || fillToken || '--shape-square-fill'})`;

  if (spec.type === 'circle') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={50 * (spec.scale || 1)} fill={fill} stroke="var(--shape-stroke)" strokeWidth="2" />
      </svg>
    );
  }

  const rawPoints = generateShapePoints(spec);
  const rotated = rotatePoints(rawPoints, spec.rotation || 0);
  const pointString = pointsToSvgString(rotated);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <polygon points={pointString} fill={fill} stroke="var(--shape-stroke)" strokeWidth="2" />

      {tappableSides && rotated.map((p, i) => {
        const next = rotated[(i + 1) % rotated.length];
        const midX = (p.x + next.x) / 2 + 60;
        const midY = (p.y + next.y) / 2 + 60;
        return (
          <circle
            key={`side-${i}`}
            cx={midX} cy={midY} r="10"
            fill={highlightedSides.has(i) ? 'var(--accent-success-green)' : 'rgba(255,255,255,0.3)'}
            onClick={() => onSideTap?.(i)}
            style={{ cursor: 'pointer' }}
          />
        );
      })}

      {tappableCorners && rotated.map((p, i) => (
        <circle
          key={`corner-${i}`}
          cx={p.x + 60} cy={p.y + 60} r="8"
          fill={highlightedCorners.has(i) ? 'var(--accent-gold)' : 'rgba(255,255,255,0.5)'}
          onClick={() => onCornerTap?.(i)}
          style={{ cursor: 'pointer' }}
        />
      ))}

      {interactive && rotated.map((p, i) => (
        <VertexDragHandle key={`vertex-${i}`} x={p.x + 60} y={p.y + 60} onDrag={(newPos) => onVertexDrag(i, newPos)} />
      ))}
    </svg>
  );
}

export default ShapeRenderer;
```

### 13.3 `components/shared/VertexDragHandle.jsx`

```jsx
function VertexDragHandle({ x, y, onDrag }) {
  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    const svg = e.target.closest('svg');
    const move = (moveEvent) => {
      const rect = svg.getBoundingClientRect();
      const scaleX = 120 / rect.width;
      const scaleY = 120 / rect.height;
      const newX = (moveEvent.clientX - rect.left) * scaleX - 60;
      const newY = (moveEvent.clientY - rect.top) * scaleY - 60;
      onDrag({ x: newX, y: newY });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <circle
      cx={x} cy={y} r="9"
      fill="var(--accent-gold)" stroke="white" strokeWidth="2"
      onPointerDown={handlePointerDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    />
  );
}
```

### 13.4 Mathematical Accuracy Requirements
Per PRD §14, every rendered shape must be geometrically correct at every rotation/scale used in the question bank:
- **Square:** all 4 sides within 1px of equal length at render scale; all 4 internal angles within 0.5° of 90°
- **Rectangle:** opposite side pairs equal; all 4 internal angles within 0.5° of 90°; non-square aspect ratio enforced (`aspectRatio !== 1`, minimum deviation 1.15:1 to avoid visual ambiguity with squares at small render sizes)
- **Triangle:** any valid triangle (this module uses equilateral/isosceles only, generated via `regularPolygonPoints(3, ...)`, for visual clarity at Grade 2 level — no scalene triangles in v1.0 question art, since irregular triangles could visually confuse early learners about "3 sides = triangle" as a general rule)
- **Circle:** rendered via native SVG `<circle>`, mathematically perfect by construction

---

## 14. Randomisation & Scoring Engine

```javascript
// utils/shuffle.js
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  const selected = Object.values(byType).flatMap(qs => shuffleArray(qs).slice(0, 10));
  const fullyShuffled = shuffleArray(selected);
  const worlds = [];
  for (let i = 0; i < 10; i++) {
    worlds.push(fullyShuffled.slice(i * 10, i * 10 + 10));
  }
  return worlds;
}

// utils/scoring.js
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

// Distractor generation for shape-set questions (Q6/Q9/Q10): ensures the
// 3 incorrect options are always the OTHER 3 target shapes, never repeats
// or invalid types, since there are exactly 4 possible shapes in this module's scope.
export function generateShapeDistractors(correctType) {
  const all = ['square', 'rectangle', 'triangle', 'circle'];
  return shuffleArray(all); // correctType is already among these 4; just shuffle the full set as options
}
```

### 14.1 Session Persistence

```javascript
const SESSION_KEY = 'intellia_shapes_2d_v1';

export function saveSession(state) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phase: state.phase,
    storySlideIndex: state.storySlideIndex,
    currentWorldIndex: state.currentWorldIndex,
    currentQuestionInWorld: state.currentQuestionInWorld,
    worldScores: state.worldScores,
    worldUnlocked: state.worldUnlocked,
    xp: state.xp,
    totalStars: state.totalStars,
    badges: state.badges,
    timestamp: Date.now(),
  }));
}

export function loadSession() {
  const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (saved && Date.now() - saved.timestamp < 86400000) return saved;
  return null;
}
```

---

## 15. Badge Engine

```javascript
export const BADGES = [
  { id: 'wonder_seeker', label: '🏅 Wonder Seeker', condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story },
  { id: 'shape_master', label: '🥈 Shape Master', condition: (s) => s.simStationsComplete.every(Boolean) },
  { id: 'geometry_star', label: '🥇 Geometry Star', condition: (s) => {
      const total = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return total >= 80;
    } },
  { id: 'perfect_sorter', label: '💎 Perfect Sorter', condition: (s) => s.worldScores.some(ws => ws === 10) },
  { id: 'streak_legend', label: '🔥 Streak Legend', condition: (s) => s.maxStreak >= 10 },
  { id: 'full_journey', label: '🌟 Full Journey', condition: (s) => Object.values(s.phaseComplete).every(Boolean) },
  { id: 'circle_champion', label: '⭕ Circle Champion', condition: (s) => s.worldScores[3] === 10 },
  { id: 'triangle_titan', label: '🔺 Triangle Titan', condition: (s) => s.worldScores[2] === 10 },
];

export function checkBadges(state) {
  return BADGES.filter(b => !state.badges.includes(b.id) && b.condition(state)).map(b => b.id);
}
```

---

## 16. Audio Implementation (ElevenLabs Pipeline — Reused Architecture)

### 16.1 Voice Profile & Settings

```javascript
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:  { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};
```

### 16.2 `scripts/generate_audio.js`

```javascript
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const phrases = [
  // Wonder
  { text: "A window grille has 4 straight sides and 4 corners that look exactly the same. A clock on the wall has no corners at all. What shapes are they?", style: 'question' },
  { text: "What if we counted the sides and corners to find out?", style: 'question' },

  // Story (body paragraphs only — never titles)
  { text: "Pip the Penguin loves the playground. Today, Pip notices something interesting — every single thing here is built from just four simple shapes!", style: 'statement' },
  { text: "The climbing frame is a square. It has 4 sides that are all the same length, and 4 corners that look exactly the same.", style: 'statement' },
  { text: "The roundabout is round all the way around — it's a circle! A circle has no straight sides and no corners at all, just one smooth curve.", style: 'emphasis' },
  { text: "The flag is a triangle with 3 straight sides and 3 corners. The bench is a rectangle with 4 straight sides — but only the opposite sides match in length!", style: 'statement' },

  // Simulate station instructions
  { text: "Drag the corners — watch the shape change live!", style: 'instruction' },
  { text: "Tap every side, then every corner!", style: 'instruction' },
  { text: "Drag each shape into its matching bin!", style: 'instruction' },
  { text: "Read the clue and pick the matching shape!", style: 'instruction' },

  // Reflect
  { text: "Tell me one way to spot a square in real life!", style: 'question' },

  // ... full set continues with all 100 question texts + hints + explanations,
  // including full verbal shape descriptions for every visual-only question
  // (See Content Bible, PRD §13, for the complete locked-text source list)
];

const RATE_LIMIT_MS = 500;
const audioMap = {};

async function generateOne(phrase) {
  const settings = VOICE_SETTINGS[phrase.style];
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.VITE_ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: phrase.text, model_id: MODEL, voice_settings: settings }),
  });
  const buffer = await response.arrayBuffer();
  const slug = slugify(phrase.text);
  const filename = `${slug}.mp3`;
  fs.writeFileSync(path.join('public/assets/audio', filename), Buffer.from(buffer));
  audioMap[phrase.text] = `/assets/audio/${filename}`;
}

async function run() {
  for (const phrase of phrases) {
    await generateOne(phrase);
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }
  fs.writeFileSync('src/utils/audioMap.js', `export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`);
  console.log(`Generated ${phrases.length} audio files.`);
}

function slugify(text) {
  return 'audio_' + text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 60);
}

run();
```

### 16.3 `src/utils/audio.js` (engine — reused verbatim from reference architecture)

```javascript
import { audioMap } from './audioMap';

let currentQueue = null;

export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'celebration' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function instruct(text) { return { text, style: 'instruction' }; }

export async function getAudioUrl(text) {
  if (audioMap[text]) return audioMap[text];
  try {
    const res = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('TTS fetch failed');
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function narrate(segments, interrupt = true) {
  if (interrupt) stopNarration();
  const queueId = Symbol();
  currentQueue = queueId;
  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== queueId) return;
    const url = await getAudioUrl(segments[i].text);
    if (url) {
      await playAudioFile(url, queueId);
    } else {
      speakWithWebSpeechAPI(segments[i].text);
    }
    if (segments[i + 1]) getAudioUrl(segments[i + 1].text);
  }
}

function playAudioFile(url, queueId) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve;
    if (currentQueue === queueId) audio.play();
    else resolve();
  });
}

function speakWithWebSpeechAPI(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  utterance.lang = 'en-SG';
  window.speechSynthesis.speak(utterance);
}

export function stopNarration() {
  currentQueue = null;
  window.speechSynthesis?.cancel();
}
```

### 16.4 `src/utils/narration.js`

```javascript
import { say, ask, cheer, emphasize, think, instruct } from './audio';

export function wonderNarration() {
  return [
    ask("A window grille has 4 straight sides and 4 corners that look exactly the same. A clock on the wall has no corners at all. What shapes are they?"),
  ];
}

export function getStoryNarration(slideIndex) {
  const slides = [
    say("Pip the Penguin loves the playground. Today, Pip notices something interesting — every single thing here is built from just four simple shapes!"),
    say("The climbing frame is a square. It has 4 sides that are all the same length, and 4 corners that look exactly the same."),
    emphasize("The roundabout is round all the way around — it's a circle! A circle has no straight sides and no corners at all, just one smooth curve."),
    say("The flag is a triangle with 3 straight sides and 3 corners. The bench is a rectangle with 4 straight sides — but only the opposite sides match in length!"),
  ];
  return [slides[slideIndex]];
}

export function simulateStationIntro(stationIndex) {
  const intros = [
    instruct("Drag the corners — watch the shape change live!"),
    instruct("Tap every side, then every corner!"),
    instruct("Drag each shape into its matching bin!"),
    instruct("Read the clue and pick the matching shape!"),
  ];
  return [intros[stationIndex]];
}

// For visual-only questions, narration must include a full verbal shape
// description since the question itself is an image, per PRD §11.4.
export function questionNarration(question) {
  if (question.visualShape) {
    return [ask(`${question.questionText} Look at this shape — ${describeShapeAloud(question.visualShape)}`)];
  }
  return [ask(question.questionText)];
}

function describeShapeAloud(shape) {
  const descriptions = {
    square: "it has four straight sides, all the same length, and four matching corners.",
    rectangle: "it has four straight sides, with opposite sides the same length, and four matching corners.",
    triangle: "it has three straight sides and three corners.",
    circle: "it has one smooth curved edge, with no straight sides and no corners.",
  };
  return descriptions[shape.type] || '';
}

export function hintNarration(question, hintLevel) {
  return [think(hintLevel === 1 ? question.hint1 : question.hint2)];
}

export function explanationNarration(question) {
  return [say(question.explanation)];
}

export function reflectPromptNarration() {
  return [ask("Tell me one way to spot a square in real life!")];
}

export const PRAISE_LINES = ['Amazing!', 'Well done!', 'Brilliant!', "You got it!"];
export function randomPraise() {
  return [cheer(PRAISE_LINES[Math.floor(Math.random() * PRAISE_LINES.length)])];
}
```

### 16.5 Sound Effects (Web Audio API — reused verbatim)

```javascript
const playTone = (frequencies, durations) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime + (durations[i - 1] || 0) / 1000);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durations[i] || 200) / 1000 + 0.5);
    osc.start(ctx.currentTime + (durations[i - 1] || 0) / 1000);
    osc.stop(ctx.currentTime + (durations[i] || 200) / 1000 + 0.5);
  });
};

export const SOUND_EFFECTS = {
  correct: () => playTone([880, 1100], [150, 150]),
  wrong: () => playTone([220], [300]),
  badge: () => playTone([523, 659, 784, 1047], [100, 100, 100, 200]),
  streak: () => playTone([440, 880], [100, 200]),
  levelUp: () => playTone([523, 659, 784, 1047, 1319], [80, 80, 80, 80, 300]),
};
```

---

## 17. CSS Animation Keyframes

```css
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 184, 46, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(245, 184, 46, 0); }
}

@keyframes celebrate {
  0% { transform: rotate(-5deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.1); }
  50% { transform: rotate(-3deg) scale(1.05); }
  75% { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}

@keyframes highlightPulse {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.6); }
  100% { filter: brightness(1); }
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

@keyframes dashFill {
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
}
```

---

## 18. Performance Requirements

| Metric | Target |
|---|---|
| Initial load time | < 2 seconds |
| Time to first interaction | < 1 second |
| SVG/animation frame rate | 60fps (including live vertex-drag morphing in Station A) |
| Memory usage | < 60MB |
| Bundle size (gzipped, excl. audio assets) | < 600KB |
| Total audio asset size (pre-generated) | Monitor; lazy-load per-phase rather than bundling all 400+ files upfront |
| Lighthouse Performance | >= 90 |
| Lighthouse Accessibility | >= 90 |

---

## 19. Browser & Device Support

| Environment | Support Level |
|---|---|
| Chrome 110+ | Full |
| Safari 15+ (iPad) | Full |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full |
| IE 11 | Not supported |

**Primary test environment:** Desktop Chrome 1280px+ (matches reference screenshots' capture environment)
**Secondary:** iPad 768px touch (Pointer Events API used for vertex dragging specifically to ensure touch parity — `onPointerDown`/`pointermove`/`pointerup`, not legacy mouse-only events)
**Tertiary:** iPhone 375px

---

## 20. WordPress Embedding

**Option A — React CDN Bundle (preferred)**
```html
<div id="shapes-2d-app"></div>
<script src="https://cdn.intelliasg.com/lessons/2d-shapes.js"></script>
```

**Option B — iframe Embed**
```html
<iframe
  src="https://lessons.intelliasg.com/grade2/2d-shapes-square-rectangle-triangle-circle"
  width="100%"
  height="760px"
  frameborder="0"
  allow="autoplay; microphone"
  style="border-radius: 12px;"
></iframe>
```

---

## 21. Quality Assurance Checklist (Expanded — Parity-Focused)

| Category | Test Case | Status |
|---|---|---|
| **Visual Parity** | Landing screen layout matches reference card structure | TBD |
| **Visual Parity** | Phase tracker shows correct completed/active/future states with correct colors | TBD |
| **Visual Parity** | Wonder screen icon-circle, headline, sub-question, hint-pill all match reference anatomy | TBD |
| **Visual Parity** | Story screen slide-progress row, illustration, title/body, fact pill, mascot nudge match reference | TBD |
| **Visual Parity** | Simulate station tabs (lettered, colored badges) match reference anatomy | TBD |
| **Visual Parity** | Play world cards (locked/unlocked/completed states) match reference anatomy | TBD |
| **Visual Parity** | Play quiz screen (stats HUD, question card, 2×2 answer grid) matches reference anatomy | TBD |
| **Visual Parity** | Color tokens verified against reference via DevTools inspection | TBD |
| **Visual Parity** | Audio toggle FAB position/style matches reference | TBD |
| **Shape Accuracy** | Square renders with all 4 sides equal and all corners at 90° at every rotation used | TBD |
| **Shape Accuracy** | Rectangle renders with correct opposite-side-equal property and is visually distinct from square | TBD |
| **Shape Accuracy** | Triangle renders with 3 equal/near-equal sides (equilateral/isosceles only in v1.0) | TBD |
| **Shape Accuracy** | Circle renders as a mathematically perfect circle at every scale | TBD |
| **Shape Accuracy** | Shape Builder station's live classification logic correctly identifies square vs. rectangle vs. quadrilateral as vertices are dragged | TBD |
| Questions | All 100 questions render without error (text AND shape-render questions) | TBD |
| Questions | MCQ always includes correct answer, no duplicate options | TBD |
| Questions | Randomisation produces unique order each session | TBD |
| Questions | 10 worlds × 10 questions partition correctly | TBD |
| Simulations | Station A vertex-drag works smoothly on touch & mouse, classification updates live | TBD |
| Simulations | Station B tap-counting correctly increments and prevents double-counting the same side/corner | TBD |
| Simulations | Station C drag-to-bin correctly accepts only matching shape type per bin | TBD |
| Simulations | Station D clue/answer pairing always correct, cycles through all 4 clues | TBD |
| Phases | All 5 phases navigate end-to-end; URL routes update correctly | TBD |
| Phases | Refresh mid-phase restores correct state from localStorage | TBD |
| Gamification | XP/star/lives/streak math all correct per §14 formulas | TBD |
| Gamification | All 8 badges unlock at correct conditions | TBD |
| Gamification | World unlock gate (>=5/10) verified | TBD |
| Audio | Pre-generated `.mp3` plays for all mapped narration text | TBD |
| Audio | Dynamic + Web Speech fallbacks both verified functional | TBD |
| Audio | Visual-only questions include full verbal shape description in narration (accessibility-critical for this module) | TBD |
| Audio | Sound effects trigger correctly for all 5 SFX types | TBD |
| Persistence | localStorage saves/restores within 24h | TBD |
| Responsive | Correct layout at 1280px, 768px, 375px; shape-render tiles remain legible at all sizes | TBD |
| Accessibility | All tap targets >=44×44px, including individual side/corner tap-points in Station B (explicit risk area) | TBD |
| Accessibility | WCAG AA contrast verified for gold-on-indigo and white-on-indigo text | TBD |
| Accessibility | Full keyboard navigation; Station A vertex-drag has a non-drag keyboard alternative | TBD |
| Performance | Load time < 2s, 60fps animations including vertex-drag morphing | TBD |
| Content Integrity | Zero content/text/character overlap with subtraction or multiplication reference modules | TBD |

---

## 22. Deployment Pipeline

| Step | Action |
|---|---|
| 1 | `npm install` |
| 2 | Lock Content Bible (PRD §13); author all phrases in `scripts/generate_audio.js` |
| 3 | Run `node scripts/generate_audio.js` — generates all `.mp3` + `audioMap.js` |
| 4 | `npm run build` (Vite production bundle) |
| 5 | Deploy `dist/` to Vercel preview |
| 6 | Run full QA checklist (§21), including side-by-side screenshot diff against reference for every screen, AND a dedicated geometric-accuracy pass over the shape renderer (§13.4) |
| 7 | Run `node scripts/clean_audio.js` to remove any orphaned audio files |
| 8 | Embed into WordPress (§20) |
| 9 | Final QA on live `intelliasg.com/courses/grade-2-math/lessons/2d-shapes-square-rectangle-triangle-circle/` |
| 10 | Set lesson status = Live in LearnPress LMS |

---

**Document Version:** 2.0 (Advanced/Detailed Revision) | June 2026
**Product:** Intellia SG — Grade 2 Math, Lesson 9.1
**Reference UI (pixel/behavior source of truth):** `https://intellia-substraction.vercel.app/`
**Reference Repo Pattern:** `https://github.com/dsamyak/numberbound`
**Technical Lead:** Intellia Engineering Team
**Curriculum Reference:** Targeting Mathematics Primary 2A/2B (Casco Publications), Singapore MOE Primary 2 Mathematics Syllabus
**Audio Pipeline Source:** Existing production ElevenLabs pipeline (`audio_generation_pipeline.md`)
