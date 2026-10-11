# Responsive AI Rally Thumbnail Grid with Neon Hover Effects

A high-performance, GameCut-inspired card grid on the homepage displaying AI-detected table tennis rallies with cyber cyan and laser lime neon hover effects, interactive category filtering, and an instant rally replay modal with AI vision telemetry.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed via interactive clarification:
> - **Card Click Action**: Clicking any rally card opens an interactive modal with focused video replay, slow-motion controls, and comprehensive AI telemetry metrics (with a secondary CTA to jump directly into the full Editor).
> - **Aesthetic & Hover Styling**: GameCut-style clean card geometry with cyber cyan (`#00F5D4`) and laser lime (`#A3E635`) neon illumination, subtle vertical card lift (`-translate-y-1.5`), and animated border glow on hover.
> - **Grid Controls & Metadata**: Category filter chips above the grid (All, 3rd-Ball Attacks, Winners, Long Duels) paired with duration and shot-count metadata, adhering strictly to the zero-pill discipline for static labels.

---

## 1. Overview & Core Concept

- **What It Does**: Presents every AI-segmented rally as a visual, high-density card within a responsive grid on the homepage. Each card displays a generated keyframe thumbnail with computer vision overlays, rally timing, shot count, winning shot classification, and neon interaction states.
- **Target Audience / Persona**: Coaches, broadcast editors, analysts, and table tennis enthusiasts reviewing match footage to quickly inspect highlights, rally structure, and AI-detected key events.
- **Key Value**: Eliminates the need to scrub through lengthy match footage or navigate away from the homepage; provides an instant, visually compelling overview of all match rallies with GameCut-grade polish.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Grid Exploration**: The user lands on the homepage and scrolls to the "AI-Detected Rallies" section directly beneath the hero match overview.
2. **Category Filtering**: The user clicks interactive filter tabs (`All Rallies`, `3rd-Ball Attacks`, `Winners`, `Extended Duels`, `By Player`) to immediately isolate specific tactical sequences.
3. **Hover Engagement**: Hovering over any card triggers an animated neon halo (cyber cyan and laser lime radial glow), elevates the card with smooth spring damping, and displays an animated play overlay.
4. **Modal Deep-Dive**: Clicking a card opens a modal displaying:
   - Synchronized looping video playback of the exact rally interval (`startTime` to `endTime`).
   - Playback speed toggles (`0.5x Slow-Mo`, `0.75x`, `1.0x Realtime`).
   - AI vision metrics: stroke classification, confidence rating, ball velocity, spin RPM, and tactical coach notes.
   - Quick navigation buttons to jump to adjacent rallies (`Previous` / `Next`).
   - "Open in Editor" button to seamlessly transfer the selected rally into the multi-track timeline editor.

### Visual Identity & Theme
- **Color Palette & Atmospheric Neon**:
  - Base: Obsidian dark surface (`#0B0F17`) with slate borders (`rgba(255, 255, 255, 0.08)`).
  - Hover Neon Glow: Dual-tone radial gradient blending cyber cyan (`#00F5D4`) and laser lime (`#A3E635`) with box-shadows: `0 0 25px rgba(0, 245, 212, 0.25), 0 0 10px rgba(163, 230, 53, 0.2)`.
  - Accent Accompanying Badges: ITTF Official cyan for Player 1, Royal blue (`#3B82F6`) for Player 2.
- **Typography & Layout Hierarchy**:
  - Headers: Clean display sans with balanced wrapping (`text-wrap: balance`).
  - Metadata: Quiet unboxed typography with typographic dot separators (`·`), strictly avoiding static pill enclosures in accordance with the frontend design constitution.
  - Numbers: Monospace tabular numerals (`font-mono tabular-nums`) for timestamps, shot counts, and speeds.
- **Responsive Layout**:
  - Mobile (<640px): 1 column with generous touch targets (>=44px).
  - Tablet (640px - 1024px): 2 columns.
  - Desktop (1024px - 1280px): 3 columns.
  - Ultra-wide (>=1280px): 4 columns.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Canvas Keyframe Thumbnail Generation vs. Static Images**
  - *Chosen Approach*: Dynamic canvas thumbnail generation that renders the exact table tennis court geometry, ball trajectory spline, and player positions at the peak impact moment (`startTime + 2.0s`) using `drawArenaFrame`.
  - *Why*: Provides authentic, crisp visuals for every sample or imported match without external image assets or broken placeholder images, while keeping bundle size minimal.
  - *Alternatives Considered*: Hardcoded SVG placeholders (too generic and lack real match feel) or capturing raw video elements (prone to cross-origin taint and async lag).

- **Decision 2: Modal Preview vs. Direct Navigation to Editor**
  - *Chosen Approach*: Modal overlay with instant looping preview and AI metrics, with a prominent "Open in Full Editor" button.
  - *Why*: Allows rapid triage and inspection without losing homepage context or incurring full timeline editor re-renders, matching GameCut's fast review experience.
  - *Alternatives Considered*: In-place card expansion (disrupts grid alignment and masonry flow) or immediate screen redirection (frustrates users wanting to browse multiple rallies).

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          HomeScreen.tsx                                │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Filter & Controls Bar                         │  │
│  │  [All (5)]  [3rd-Ball (2)]  [Winners (4)]  [Duels >6]  [Timo]    │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
│                                    │ filterPreset                      │
│  ┌─────────────────────────────────▼────────────────────────────────┐  │
│  │                     RallyGrid Component                          │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│  │
│  │  │   RallyCard #1   │  │   RallyCard #2   │  │   RallyCard #3   ││  │
│  │  │  • Neon Glow     │  │  • Neon Glow     │  │  • Neon Glow     ││  │
│  │  │  • Canvas Thumb  │  │  • Canvas Thumb  │  │  • Canvas Thumb  ││  │
│  │  │  • Unboxed Meta  │  │  • Unboxed Meta  │  │  • Unboxed Meta  ││  │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘│  │
│  └───────────┼─────────────────────┼─────────────────────┼──────────┘  │
└──────────────┼─────────────────────┼─────────────────────┼─────────────┘
               │ onClick(rally)      │ onClick(rally)      │
               ▼                     ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        RallyPreviewModal.tsx                           │
│                                                                        │
│  ┌──────────────────────────────────┐ ┌─────────────────────────────┐  │
│  │      Rally Video Loop Player     │ │     AI Telemetry HUD        │  │
│  │  • Auto-loop [start → end]       │ │  • Stroke: Loop (99.4%)     │  │
│  │  • Speed: 0.5x | 0.75x | 1.0x    │ │  • Ball: 114 km/h · 2840 RPM│  │
│  │  • Prev / Next Rally Controls    │ │  • ITTF Score Progression   │  │
│  └──────────────────────────────────┘ │  • Tactical Coach Synthesis│  │
│                                       │                             │  │
│                                       │  [ Open in Full Editor → ]  │  │
│                                       └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Mapping
- `rallies: RallyInterval[]`: Sourced from `useRallyCut()`, validated through Zod schemas.
- `selectedCategory: 'all' | 'third_ball' | 'winners' | 'extended' | 'p1' | 'p2'`: Local filter state managing visible subset.
- `previewRally: RallyInterval | null`: Active rally in the preview modal; keyboard events (`Escape`, `ArrowLeft`, `ArrowRight`) provide effortless navigation.
- `playbackSpeed: number`: Local modal speed state (`0.5`, `0.75`, `1.0`).

### Interactive Component & State Transitions
- **Hover on Card**: CSS transitions trigger `-translate-y-1.5` lift, neon cyan-lime box-shadow expansion, and play icon fade-in (`opacity-0 -> opacity-100`).
- **Filter Click**: Instant re-render of grid items with smooth entry transitions.
- **Card Click**: Sets `previewRally` in state, locking background scroll and mounting `RallyPreviewModal`.
- **Modal Prev/Next**: Updates `previewRally` to adjacent rally in filtered list with wrap-around boundaries.
- **Open in Editor**: Invokes `seekToRally(rally.id)`, sets `setActiveScreen('editor')`, and closes modal.
