# Imprint — MVP Implementation Spec

**For:** Openclaw / AI coding agent
**Date:** February 22, 2026
**Goal:** Build a working MVP where a user has a voice conversation with an AI brand strategist, watches markdown files build in real-time, then downloads a zip of structured brand files ready for AI agents.

---

## What This Is

Imprint is a voice-based brand strategy tool. The user picks a module (like "Brand Positioning" or "Voice & Tone"), starts a voice session with an AI agent, has a 5-10 minute conversation where the AI asks sharp, thought-provoking questions, and walks away with a downloadable zip of structured markdown files that any AI tool (Claude Code, Cursor, ChatGPT custom instructions) can consume.

Think: Granola (the meeting notes tool) meets a brand consultant.

---

## ⚠️ FRONTEND HANDOFF — START HERE

The idle-state UI is **already built** and included as `imprint-handoff.zip`. This is a complete Vite + React 19 + Tailwind CSS 4 project with all components, images, fonts, and design tokens. **DO NOT rebuild these components. Extend this codebase.**

### Quick Start
```bash
unzip imprint-handoff.zip
cd imprint
npm install
npm run dev    # → http://localhost:5173
```

### What's Already Built
| Component | File | Status |
|-----------|------|--------|
| Top nav bar | `Navbar.jsx` | ✅ Complete |
| Hero panel (left, images + floating bar) | `HeroPanel.jsx` | ✅ Complete |
| Floating pill (audio bars + agent name + CTA) | `FloatingBar.jsx` | ✅ Complete |
| Sidebar (title, modules, agents, CTA) | `Sidebar.jsx` | ✅ Complete with local state |
| Agent cards (120×137, selectable) | `AgentCard.jsx` | ✅ Complete |
| Module checkboxes (with duration badge) | `ModuleItem.jsx` | ✅ Complete |

### Assets Included
- `hero-figure.png` (1376×768) — Main ethereal figure
- `hero-overlay.png` (2752×1536) — Glow/gradient overlay
- `agent-card-bg.png` (1376×768) — Agent card backgrounds
- `logo.svg` (18×18) — Imprint mark
- `AwesomeSerif-*.otf` — All weights (300-600) in upright + italic

### Critical: Font & Token System
- Font is **Awesome Serif** (bundled OTF), NOT Fraunces. Tailwind class: `font-awesome-serif`
- Body font is **Inter** (system). Tailwind class: `font-inter`
- All design tokens are in `src/index.css` via Tailwind 4's `@theme {}` directive
- DO NOT use a `tailwind.config.js` — tokens live in CSS

### Design Token Reference (from `@theme`)
```css
--color-brand-dark: #010506;      /* Page bg, nav */
--color-brand-surface: #020607;   /* Sidebar bg */
--color-brand-panel: #0f0f0f;     /* Hero panel bg */
--color-brand-sidebar: #1c1c1c;   /* Alt surface (sessions page) */
--color-brand-accent: #d97706;    /* Amber accent */
--color-brand-success: #46a758;   /* Green (audio bars active) */
--color-neutral-50: #ededed;      /* Primary text */
--color-neutral-200: #8e8e93;     /* Secondary text */
--color-neutral-300: #525252;     /* Labels, unchecked borders */
--color-neutral-600: #333333;     /* Hover borders */
--color-neutral-700: #2f2f2f;     /* Badge bg */
--color-neutral-800: #2a2a2a;     /* Dividers, card borders */
```

### Component Props to Wire Up
```js
// All callbacks are prop-based — connect to Zustand store / router
<Navbar onSessionsClick={} onSettingsClick={} activeLink="sessions" />
<HeroPanel agentName="STRATEGIST" onStartSession={} />
<Sidebar onStartSession={} onAgentChange={(id) => {}} onModulesChange={(map) => {}} />
```

### Sidebar Layout Behavior
- Uses `flex-col justify-between gap-12` on `<aside>`
- Top group: Title + Modules (scrollable)
- Bottom group: Agents + CTA (pins to bottom on tall viewports)
- `overflow-y-auto` with custom 4px scrollbar

### What You Need to ADD to This Codebase
1. **Routing** — react-router-dom (or convert to Next.js)
2. **Avatar animation** — Breathing, glow, particle aura (see section below)
3. **Active session state** — MicIndicator + LiveDocument components
4. **Session complete state** — Read-only doc + download button
5. **Sessions page** — `/sessions` route
6. **Ambient audio** — Background music on idle
7. **ElevenLabs** — Voice conversation engine
8. **Zustand store** — Global session state
9. **JSZip export** — Zip generation from session data
10. **Supabase** — Auth + persistence (skip for demo)

Full specs in `HANDOFF.md` and `DESIGN-SYSTEM.md` inside the zip.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 (from handoff) — OR convert to Next.js 14 if you need API routes |
| Styling | Tailwind CSS 4 (`@theme` tokens already configured) |
| Voice AI | ElevenLabs Conversational AI SDK (`@11labs/client`) |
| LLM | Claude Sonnet 4.5 via ElevenLabs BYO-LLM or direct Anthropic API |
| Database | Supabase (PostgreSQL + Realtime) |
| Auth | Supabase Auth (Google OAuth) |
| Export | JSZip (client-side zip generation) |
| Audio | Web Audio API (ambient music + avatar audio reactivity) |
| Avatar FX | Canvas 2D overlay (particles) + CSS animations (breathing/glow) |
| Hosting | Vercel |
| Fonts | Awesome Serif (OTF bundled) + Inter (system) |

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=
```

---

## File Structure

```
imprint/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── page.tsx                    # Main app (idle + active session)
│   ├── sessions/
│   │   └── page.tsx                # Past sessions list
│   ├── sessions/[id]/
│   │   └── page.tsx                # Single session viewer/editor
│   └── api/
│       ├── session/
│       │   ├── route.ts            # POST: create session, GET: list sessions
│       │   └── [id]/route.ts       # GET: session detail, PATCH: update
│       ├── elevenlabs/
│       │   └── signed-url/route.ts # Generate signed URL for ElevenLabs
│       └── export/
│           └── [id]/route.ts       # GET: generate zip for session
├── components/
│   ├── AvatarPanel.tsx             # Left panel — avatar + mic indicator
│   ├── Sidebar.tsx                 # Right panel — config / live doc / editor
│   ├── ConfigPanel.tsx             # Agent + module selector (idle state)
│   ├── LiveDocument.tsx            # Real-time markdown streaming (active state)
│   ├── SessionEditor.tsx           # Tiptap editor (post-session)
│   ├── MicIndicator.tsx            # Floating pill with waveform bars
│   ├── AgentCard.tsx               # Selectable agent avatar card
│   ├── ModuleCheckbox.tsx          # Module toggle with time badge
│   ├── SessionCard.tsx             # Card for past sessions list
│   ├── Navbar.tsx                  # Top nav bar
│   └── AmbientAudio.tsx            # Background music controller
├── lib/
│   ├── elevenlabs.ts               # ElevenLabs SDK setup + conversation mgmt
│   ├── supabase.ts                 # Supabase client
│   ├── session-store.ts            # Zustand store for session state
│   ├── prompts/
│   │   ├── system-base.ts          # Base system prompt for all agents
│   │   ├── strategist.ts           # The Strategist persona prompt
│   │   ├── creative.ts             # The Creative Director persona prompt
│   │   └── coach.ts                # The Coach persona prompt
│   ├── modules/
│   │   ├── brand-positioning.ts    # Question script + output template
│   │   ├── voice-tone.ts           # Question script + output template
│   │   ├── brand-persona.ts        # Question script + output template
│   │   └── vision-values.ts        # Question script + output template
│   ├── templates/
│   │   ├── brand-positioning.md    # Output file template
│   │   ├── voice-tone.md           # Output file template
│   │   ├── brand-persona.md        # Output file template
│   │   ├── vision-values.md        # Output file template
│   │   └── README.md               # Exported zip README template
│   └── export.ts                   # JSZip generation logic
├── public/
│   └── audio/
│       └── ambient-idle.mp3        # Soothing ambient loop for idle state
├── types/
│   └── index.ts                    # TypeScript interfaces
└── supabase/
    └── migrations/
        └── 001_initial.sql         # Database schema
```

---

## Database Schema

```sql
-- Sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  brand_name text,
  module text not null, -- 'positioning' | 'voice-tone' | 'persona' | 'vision-values'
  agent text not null,  -- 'strategist' | 'creative' | 'coach'
  status text default 'active', -- 'active' | 'completed' | 'paused'
  duration_seconds integer default 0,
  transcript jsonb default '[]',
  document jsonb default '{}', -- structured sections from the session
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table sessions enable row level security;
create policy "Users can manage own sessions"
  on sessions for all using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table sessions;
```

---

## Avatar Animation System

The hero panel currently shows a static ethereal figure (`hero-figure.png` + `hero-overlay.png`). The goal is to make it feel **alive** — breathing, glowing, reacting to the conversation — while keeping the dark, cinematic aesthetic. We do NOT want a realistic talking head. We want an abstract, ethereal presence that responds to voice.

### Tiered Approach

Build Tier 1 first (MVP), add Tier 2 when core flow works, Tier 3 is V2.

#### Tier 1: CSS Animations (MVP — 30 min effort)

Zero dependencies. Layer CSS animations on the existing `<HeroPanel>` images.

**Add to `src/index.css`:**
```css
/* ── Avatar breathing — subtle scale pulse ── */
@keyframes avatar-breathe {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.008) translateY(-2px); }
}
.animate-avatar-breathe {
  animation: avatar-breathe 6s ease-in-out infinite;
}

/* ── Ambient float — slight drift for underwater feel ── */
@keyframes avatar-float {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
}

/* ── Glow overlay states ── */
@keyframes glow-idle {
  0%, 100% { opacity: 0.6; filter: brightness(1); }
  50% { opacity: 0.75; filter: brightness(1.1); }
}
@keyframes glow-active {
  0%, 100% { opacity: 0.8; filter: brightness(1.15); }
  50% { opacity: 1; filter: brightness(1.3); }
}
@keyframes glow-speaking {
  0% { opacity: 0.7; filter: brightness(1.1); }
  30% { opacity: 0.95; filter: brightness(1.25); }
  60% { opacity: 0.75; filter: brightness(1.1); }
  100% { opacity: 0.7; filter: brightness(1.1); }
}

.animate-glow-idle { animation: glow-idle 4s ease-in-out infinite; }
.animate-glow-active { animation: glow-active 1.5s ease-in-out infinite; }
.animate-glow-speaking { animation: glow-speaking 2s ease-in-out infinite; }
```

**Modify `HeroPanel.jsx`:** Add `animate-avatar-breathe` class to the figure image. Swap glow class on overlay image based on `micState` from Zustand store. Add a `<div>` behind images with a radial gradient that shifts color by state (green tint when listening, amber when AI speaks, neutral when idle).

#### Tier 2: Canvas Particle Aura (V1 — 2-3 hours)

Add a transparent `<canvas>` overlay on top of hero images. Draw 40-80 tiny particles (1-3px, low opacity) floating in elliptical orbits around the figure. Particles react to audio level from Web Audio API `AnalyserNode`:

| State | Particle Behavior |
|-------|------------------|
| **Idle** | Slow lazy drift, low opacity (0.05-0.15), warm white |
| **Listening** | Faster orbit, wider spread, brighter — scales with mic amplitude |
| **Processing** | Particles converge toward center (thinking effect) |
| **AI Speaking** | Rhythmic pulse with audio output amplitude, subtle amber glow halos |

**Getting audio amplitude:**
```js
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const source = audioCtx.createMediaStreamSource(micStream);
source.connect(analyser);

const dataArray = new Uint8Array(analyser.frequencyBinCount);
function updateLevel() {
  analyser.getByteFrequencyData(dataArray);
  const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  store.setAudioLevel(Math.min(avg / 128, 1)); // normalized 0-1
  requestAnimationFrame(updateLevel);
}
```

Create `lib/avatar-particles.js` as a class that manages the canvas particle loop, and `components/AvatarCanvas.jsx` as the React wrapper. Canvas sits at `z-10`, `pointer-events: none`, absolutely positioned over the hero panel.

Particle colors: `rgba(237, 222, 200, opacity)` for base dots, `rgba(217, 119, 6, opacity * 0.15)` for amber glow halos on larger particles.

#### Tier 3: Rive Animation (V2 — 2-3 weeks)

Replace the static PNG with a commissioned Rive animation (.riv) featuring:
- Idle loop: breathing, blinking, subtle weight shifts
- Lip-sync: driven by ElevenLabs viseme data via Mascot Bot SDK (`@rive-app/react-canvas` + `useMascotElevenlabs` hook). The Mascot Bot SDK proxies ElevenLabs WebSocket to extract viseme data and maps it to Rive state machine inputs for natural mouth movement.
- Gesture reactions: nodding (after user speaks), thinking pose (processing), slight lean-in (engaged listening)
- Per-agent skins: different visual appearance per persona (Strategist vs Creative vs Coach)

Tech: `@rive-app/react-canvas` for rendering, `mascotbot-sdk-react` for ElevenLabs viseme bridging. Requires creating the actual .riv file with properly named state machine inputs.

**For MVP: Tier 1 is enough. The breathing + glow state changes make the avatar feel alive without any heavy lifting.**

### Updated HeroPanel Structure

```jsx
<div className="relative h-full overflow-hidden border-r border-neutral-800 bg-brand-panel">
  {/* 1. Radial halo — shifts color by state */}
  <div className="absolute inset-0 transition-all duration-1000 z-[1]" style={{...}} />

  {/* 2. Figure image — with breathing animation */}
  <img className="... animate-avatar-breathe" src={heroFigure} />

  {/* 3. Glow overlay — animation class swaps by state */}
  <img className={`... ${glowAnimClass}`} src={heroOverlay} />

  {/* 4. Particle canvas (Tier 2) — transparent overlay */}
  <AvatarCanvas /> {/* z-10, pointer-events-none */}

  {/* 5. Floating bar (idle) or Mic indicator (active) */}
  {state === 'idle' ? <FloatingBar /> : <MicIndicator />}
</div>
```

---

## The Three App States

The main page (`app/page.tsx`) has one layout with three states. The layout never changes — it's always a two-panel split:

```
┌──────────────────────────┬────────────────┐
│                          │                │
│     AVATAR PANEL         │    SIDEBAR     │
│     (76.5% width)        │   (23.5%)      │
│                          │                │
│     - Dark bg #0f0f0f    │   - #020607    │
│     - Avatar center      │   - Switches   │
│     - Mic indicator      │     content    │
│       at bottom          │     per state  │
│                          │                │
└──────────────────────────┴────────────────┘
```

### State 1: IDLE (default)

**Avatar Panel:**
- Static/gently animated avatar illustration (CSS gradient glow placeholder for MVP — Rive in V2)
- The avatar is a dark ethereal glowing figure, centered in the panel. For MVP, use a radial gradient glow effect with CSS:
  - A large rounded container (300x360px, rounded-150px) with `background: linear-gradient(to bottom, #222, #151515)`, `border: 1px solid rgba(217,119,6,0.3)`, `box-shadow: 0px 0px 80px rgba(217,119,6,0.2)`
  - Inside, a blurred amber radial gradient for inner glow
  - A subtle radial gradient on the outer panel: `radial-gradient(circle, rgba(255,255,255,0.03), transparent 60%)`
- Floating pill at bottom center: `[ ▮▮▮▮  STRATEGIST  [ Start Session ] ]`
  - 4 static waveform bars (3px wide, 6-12px tall, white at 16% opacity, rounded-2px, gap-3px)
  - Agent name in Inter semibold 13.6px, rgba(237,237,237,0.72), uppercase
  - "Start Session" pill button (white #ededed bg, black text, Georgia/serif 12px, rounded-999px, h-32px, px-12px)
  - Pill container: `backdrop-blur(6px)`, `bg: rgba(37,37,37,0.67)`, `border: 1px solid #333`, `rounded-999px`, `shadow: 0px 10px 40px rgba(0,0,0,0.5)`, padding: 8px 8px 8px 16px, gap 16px

**Sidebar:**
- Background: #020607, padding: 32px, flex column with justify-between (button sticks to bottom)
- Title: "Build Your Brand, Out Loud" (32px, Georgia/serif, white, tracking 0.64px)
- Subtitle: "One conversation and you walk away with structured brand files your AI tools can actually use." (14.4px Inter, #8e8e93, line-height 21.6px)
- Gap between title block and agent selector: 33px

- **Agent Selector:**
  - Label: "SELECT AGENT" (Inter semibold 11.2px, #525252, uppercase, tracking 0.56px)
  - 3 cards in a horizontal row, gap 12px
  - Each card: 120x137px, rounded-24px, border 1px #2a2a2a, bg #020607
  - Card has a gradient overlay at bottom: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))`
  - Label block at bottom (top: 84px, left: 11px): Agent name (Inter semibold 13.6px, #ededed) + subtitle (Inter 11.2px, #8e8e93, uppercase, tracking 0.56px)
  - Cards:
    - **STRATEGIST** — "Big Picture" (selected by default — brighter text, overlay image visible)
    - **CREATIVE** — "Visual Style"
    - **GUIDE** — "Growth"
  - Selected state: text color full #ededed. Unselected: rgba(237,237,237,0.72). Add a subtle white border glow on selected.

- **Module Selector:**
  - Label: "MODULES" (same style as agent label)
  - 4 rows, each is a flex row with space-between, px-13px py-11px, rounded-6px
  - Left side: checkbox + label
    - Checkbox: 16x16px, rounded-4px
    - Checked: white bg, white border, black ✓ (10px SF Pro or just a Unicode ✓)
    - Unchecked: transparent bg, #525252 border
    - Label: Inter 14.4px, #ededed
  - Right side: time badge
    - bg #2f2f2f, border 1px #2a2a2a, rounded-4px, h-20.5px
    - Text: Inter 12px, #8e8e93, px-6px
  - Modules:
    - ☑ Brand Positioning — 15m (checked by default)
    - ☐ Voice & Tone — 10m
    - ☐ Persona Development — 20m
    - ☐ Vision & Values — 15m

- **Start Session Button:**
  - Full width, h-48px, bg #ededed, border 1px white, rounded-46px
  - Text: "Start Session" (Georgia/serif 16px, black, centered)
  - Disabled state: opacity 0.4, pointer-events none (when no modules selected)

**Background Audio:**
- Soothing ambient loop plays on idle state at low volume (20-30%)
- Fades out when session starts (1 second), fades back in when returning to idle (2 seconds)
- User can toggle audio on/off via a small speaker icon near the bottom-left of the avatar panel or in nav
- Source: Use a royalty-free ambient track. Search "dark ambient drone loop 60 seconds" on Pixabay or Freesound.org. Keep under 500KB (60s mono MP3 at 64kbps).
- Store at `/public/audio/ambient-idle.mp3`
- Implementation: See AmbientAudio component section below

### State 2: ACTIVE SESSION

Triggered when user clicks "Start Session" → mic permission requested → ElevenLabs connection opens.

**Avatar Panel:**
- Same avatar glow (later: avatar lip-syncs and reacts)
- Floating pill becomes **Mic Indicator** — same position, same glass-pill styling, but content changes:

| State | Visual | Color | Label |
|-------|--------|-------|-------|
| READY | 4 static bars (6-10px tall) | rgba(255,255,255,0.3) | "Ready" |
| LISTENING | 4 bars animate (random heights 4-16px, update every 120ms) | #46a758 green | "Listening..." |
| PROCESSING | 3 dots pulsing (opacity animation) | #d97706 amber | "Thinking..." |
| AI_SPEAKING | 4 static bars (low height, muted) | rgba(255,255,255,0.16) | "Speaking..." |
| ERROR | 4 static bars | #dc2626 red | "Connection lost" |

**Sidebar (Live Document):**
- Header: border-bottom 1px #2a2a2a, h-78px, px-48px (relative to sidebar inner), pt-48px
  - Module title: Fraunces 24px, #ededed, tracking -0.48px
  - Below title: "Live Capturing • MM:SS" — Inter 13px, #d97706 amber
  - Right-aligned: Pause button — border 1px #3f3f3f, rounded-20px, w-72px h-33.5px, text "Pause" Inter 13.3px #ededed
- Content area: px-48px, starts below header
  - Sections stream in top-to-bottom as AI captures them
  - Each section:
    - Amber left border: 2px solid #d97706
    - Title: Fraunces 20px, #ededed, line-height 24px, padding-left 12px from border
    - Body: Inter 15.2px, #8e8e93, line-height 24.32px, padding-left 0 (full width below title)
    - Typing effect: characters appear one by one (~25ms per char), amber cursor `|` blinks at end (#d97706, animation: blink 0.8s infinite)
  - Upcoming sections (not yet captured): shimmer skeleton loaders
    - 3 skeleton lines: heights 14px, widths 70%, 100%, 55%, rounded-4px
    - Background: `linear-gradient(90deg, #2a2a2a 0%, #333 20%, #2a2a2a 40%, #2a2a2a 100%)`
    - Animation: shimmer slides left-to-right, 1.5s infinite

### State 3: SESSION COMPLETE

When the AI finishes all sections or user clicks "End Session":
- Mic indicator disappears, floating pill returns showing "Session Complete ✓"
- Sidebar: all sections now static (no typing animation)
- "Download Files" button appears at top of sidebar (amber bg, black text)
- "Start New Session" text link below

---

## Sessions Page (`/sessions`)

Full-width centered layout (max-width ~800px, centered on dark bg #1c1c1c page).

**Header:**
- "Past *Sessions*" — Fraunces 27.1px, "Past " in #ededed, "Sessions" in italic #d97706
- Subtitle: "Review your brand architecture documents and transcripts." (Inter 14.4px, #8e8e93, line-height 21.6px)
- Top padding: 60px, bottom gap to cards: ~40px

**Session Cards:**
Cards are inside a single container (bg #2a2a2a, border 1px #2a2a2a, rounded-12px, overflow hidden).
Each card is bg #1c1c1c, stacked with 1px #2a2a2a divider between them.

Card inner layout (padding 20px):
```
┌─────────────────────────────────────────────┐
│ [icon]  Title                               │
│ [40px]  Agent  •  Date  •  N Modules        │
│                                             │
│ [indent 80px from left]                     │
│         Summary text (2 lines max)          │
│                                             │
│         Open Document →                     │
└─────────────────────────────────────────────┘
```

- Icon badge: 40x40px, rounded-8px, bg rgba(217,119,6,0.1), border 1px rgba(217,119,6,0.2)
  - Icon inside: 17.6px, #d97706, centered
  - Icons per module: ✦ (positioning), ✎ (voice-tone), ⬡ (vision-values), ● (persona)
- Title: Inter 16px Medium, #ededed (left-aligned at 80px from card left)
- Metadata row: Inter 12px, #525252, items separated by • (2px dot, #525252) with 8px gaps
  - Agent name • Date (e.g. "Oct 24") • "N Modules"
- Summary: Inter 13.6px, #8e8e93, line-height 20.4px, max 2 lines with overflow hidden, starts at 80px indent
- "Open Document →": Inter 12.8px, #d97706, left-aligned at 80px, clickable → navigates to `/sessions/[id]`

Card heights: ~153px for cards with 2-line summaries, ~133px for 1-line.

Hover state: subtle background lighten (bg #222) or border glow.

---

## ElevenLabs Voice Integration

### Setup

```typescript
// lib/elevenlabs.ts
import { Conversation } from '@11labs/client';

export async function startConversation(config: {
  systemPrompt: string;
  onMessage: (message: any) => void;
  onModeChange: (mode: { mode: string }) => void;
  onStatusChange: (status: { status: string }) => void;
  onError: (error: Error) => void;
}) {
  // Get signed URL from backend
  const res = await fetch('/api/elevenlabs/signed-url');
  const { signedUrl } = await res.json();

  const conversation = await Conversation.startSession({
    signedUrl,
    overrides: {
      agent: {
        prompt: {
          prompt: config.systemPrompt,
        },
      },
    },
    onMessage: config.onMessage,
    onModeChange: config.onModeChange,
    onStatusChange: config.onStatusChange,
    onError: config.onError,
  });

  return conversation;
}
```

### Backend Signed URL Route

```typescript
// app/api/elevenlabs/signed-url/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.ELEVENLABS_AGENT_ID}`,
    {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY! },
    }
  );
  const data = await response.json();
  return NextResponse.json({ signedUrl: data.signed_url });
}
```

### Mic State Machine

```typescript
// Map ElevenLabs events to mic states
onModeChange: ({ mode }) => {
  if (mode === 'listening') setMicState('LISTENING');
  if (mode === 'speaking') setMicState('AI_SPEAKING');
}

onStatusChange: ({ status }) => {
  if (status === 'connecting') setMicState('READY');
  if (status === 'connected') setMicState('LISTENING');
  if (status === 'disconnected') setMicState('READY');
}

// Transition: user stops talking → PROCESSING (500ms) → AI_SPEAKING
// Detect this by: LISTENING → mode change to not-listening → set PROCESSING → wait for 'speaking' mode
```

### MVP Fallback (No ElevenLabs Key)

If `ELEVENLABS_API_KEY` is not set, fall back to browser-based flow:
1. Use Web `SpeechRecognition` API for speech-to-text
2. Send transcript to `/api/chat` which calls Anthropic Claude API directly
3. Use browser `SpeechSynthesis` for text-to-speech (robotic but functional)
4. This lets you demo the full conversational flow without ElevenLabs

```typescript
// app/api/chat/route.ts — fallback chat endpoint
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const { messages, systemPrompt } = await req.json();
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return Response.json({ content: response.content[0].text });
}
```

---

## Question Scripts (The Soul of the Product)

These are NOT boring survey questions. They should feel like talking to a brilliant friend who happens to be a brand strategist. The questions are provocative, specific, and designed to pull real answers out of people.

### System Prompt Base (All Agents)

```
You are a world-class brand strategist having a voice conversation. Your job is to extract deep, specific insights through natural conversation — not an interview.

CRITICAL RULES:
1. NEVER accept vague answers. If someone says "we help businesses grow" — push back: "Every company says that. What specifically happens differently because you exist?"
2. Use their own words back to them. When they say something interesting, mirror it: "You just said [exact words]. That's actually your positioning. Did you hear it?"
3. Keep it SHORT. Each response: 2-3 sentences max. This is a conversation, not a monologue.
4. Be genuinely curious, not performatively curious. Ask follow-ups that prove you understood.
5. When you have enough for a section, announce it naturally: "Okay, I've got a clear picture of [topic]. Let me capture that." Then emit the section data.
6. After capturing, transition: "Alright, now here's what I really want to know... [next question]"
7. If the user seems stuck, reframe: "Let me ask it differently..." or use an analogy or scenario.
8. End the session by reading back the highlights. Ask if anything feels off.
9. MAKE IT FUN. Throw in unexpected angles. Use analogies. Make them laugh at least once.
10. No buzzwords. No consultant-speak. Talk like a real person.

SECTION UPDATES:
When you have enough info for a section, include this block in your response:
<section_update>
{"section": "section-slug", "title": "Section Title", "content": "The captured content in clear prose..."}
</section_update>

The frontend parses these and renders them in the live document sidebar.

PACING:
- Start with an easy warm-up (get them talking, build comfort)
- Get progressively deeper and more provocative
- Module should take 5-8 minutes
- After 8 minutes, begin wrapping up
- NEVER exceed 10 minutes — synthesize what you have
- If they give gold early, skip ahead — don't pad the session

CONVERSATION FEEL:
- Like a great dinner party conversation, not a boardroom
- Use contractions (you're, it's, that's)
- Humor is encouraged — but never at the user's expense
- React to surprising answers ("Wait, really? Tell me more about that")
- Use silence as a tool — don't fill every gap
- Reference things they said earlier to show you're really listening
```

### Agent Persona: The Strategist

```
PERSONA: The Strategist
PERSONALITY: Sharp, structured, cuts through noise. Like a top-tier brand consultant who bills $500/hr and doesn't waste time. Thinks in frameworks but communicates in plain language. Respects the user's time.

VOICE CHARACTERISTICS:
- Calm, measured, authoritative
- Medium pace, no filler words
- Direct without being cold
- Uses "here's what I think is happening" and "let's pressure-test that"

SIGNATURE MOVES:
- Catches contradictions: "Earlier you said X, now you're saying Y. Which is the real one?"
- Forces specificity: "That's the 30,000 foot view. Take me to street level."
- Names patterns: "I've seen this before — you're building a [category] but positioning like a [different category]."

EXAMPLE LINES:
- "Let's get specific — what can you do that nobody else can?"
- "That's the surface answer. What's underneath that?"
- "So what I'm hearing is [X]. That's your positioning. Does that feel right?"
- "I want to push back on something you said..."
```

### Agent Persona: The Creative Director

```
PERSONA: The Creative Director
PERSONALITY: Warm, expressive, taste-driven. Has seen a thousand brands and knows what makes the good ones click. Thinks in analogies and references. Gets excited when something clicks.

VOICE CHARACTERISTICS:
- Energetic, slightly faster pace, animated
- Uses pop culture and brand references freely
- Expressive reactions ("Oh, that's interesting", "I love that")
- Conversational tangents that lead somewhere

SIGNATURE MOVES:
- Catches revealing word choices: "Oh you used the word 'scrappy' three times. That IS your brand."
- Makes unexpected connections: "You know who does this well? Patagonia. But here's where you're different..."
- Gets excited about raw gems: "Wait, say that again. That exact phrase. That's your tagline."

EXAMPLE LINES:
- "Okay forget everything — if your brand had a soundtrack, what's playing?"
- "You know who you remind me of? Not a competitor — [unexpected reference]."
- "I love that. That's your thread. Everything else hangs off that."
- "That gave me chills. Write that down. Actually, I'm writing it down for you."
```

### Agent Persona: The Coach

```
PERSONA: The Coach
PERSONALITY: Patient, encouraging, great at pulling answers out of people who struggle to articulate. Never makes the user feel dumb. Reframes when someone is stuck.

VOICE CHARACTERISTICS:
- Warm, slightly slower pace, supportive
- Lots of affirmation ("That's a great start", "You're onto something")
- Rephrases things back to validate understanding
- Comfortable with silence — gives space to think

SIGNATURE MOVES:
- Reframes hard questions: "Let's try it this way — imagine explaining this to your mom at dinner."
- Builds confidence: "You actually just answered your own question. Did you hear it?"
- Breaks big things down: "Don't try to say everything. Just tell me one thing."

EXAMPLE LINES:
- "That's a great start — let's build on that."
- "Don't overthink it — just tell me what comes to mind."
- "You know more about this than you think. What's the first thing that pops up?"
- "Perfect. See? You didn't need me for that one."
```

---

### Module: Brand Positioning

```
MODULE: Brand Positioning
SECTIONS TO FILL: company-overview, value-proposition, target-audience, competitive-landscape, positioning-statement
ESTIMATED TIME: 7 minutes

QUESTION FLOW:

[WARM-UP — get them comfortable and talking]
"Alright, let's start simple. Forget the elevator pitch — just tell me: what does your company actually do, day to day?"

[DIG INTO WHY — make it personal]
"Okay, so you do [X]. But here's what I really want to know — what pissed you off enough to build this? What's the origin story?"

(If they gave a polished/corporate answer):
"That sounds like your LinkedIn headline. Give me the version you'd tell a friend at a bar at 11pm."

→ Emit section: company-overview

[FIND THE CUSTOMER — make it specific]
"Who desperately needs this? Not a demographic — give me one specific person. What's their name? What do they do at 9am on a Tuesday?"

"What's their biggest headache that you fix? Like, the thing they complain about in Slack channels and group chats?"

→ Emit section: target-audience

[COMPETITIVE LANDSCAPE — get honest]
"Who else is trying to solve this? Be honest — who shows up when someone Googles your thing?"

"Okay so there's [competitors]. What do they get fundamentally wrong? Not tactically — philosophically. What do they misunderstand about the problem?"

→ Emit section: competitive-landscape

[THE KILL QUESTION — reveal true differentiation]
"Here's the real test. If your company vanished tomorrow — poof, gone — what would your customers actually do? Would they even notice?"

(This reveals true differentiation. If they struggle, that's the real insight.)

"So what's the one thing only you can do? The thing that would be really, really hard for someone else to copy?"

→ Emit section: value-proposition

[SYNTHESIS — confirm and push]
"Okay here's what I'm hearing. For [audience] who [pain point], you're the [category] that [unique value] because [reason]. Does that feel right, or did I miss something?"

(If something feels off, push):
"I want to push on one thing — you said [X] but then also said [Y]. Those feel like they might be in tension. Which one is really you?"

→ Emit section: positioning-statement

[WRAP]
"Alright, that's really strong. Here's your positioning in a nutshell: [summary]. I've captured everything. Take a look at the document — anything you want to adjust?"

[ALTERNATIVE ANGLES — use if conversation stalls]
- "If your brand were a person at a dinner party, what would they be talking about? What would they NEVER talk about?"
- "Finish this sentence: 'We're the only company that...'"
- "Your best customers love you. But what do they love you FOR? Not the product — the feeling."
- "If a journalist wrote a one-line description of you, what would you want it to say?"
- "What's the most expensive problem you solve? Like, what does it cost someone to NOT use you?"
```

### Module: Voice & Tone

```
MODULE: Voice & Tone
SECTIONS TO FILL: brand-personality, tone-mapping, voice-guardrails, do-dont-examples, formality-spectrum
ESTIMATED TIME: 6 minutes

QUESTION FLOW:

[WARM-UP — fun and sensory]
"Okay, weird question. If your brand walked into a party — what's it wearing? How does it greet people? Does it head to the DJ booth or the quiet balcony?"

(This sounds playful but reveals brand personality fast.)

→ Partially inform: brand-personality

[PERSONALITY EXTRACTION — triangulate]
"Now give me three words that describe how you want to sound. And then — this is the fun part — three words that are the absolute OPPOSITE. The words that would make you cringe."

"You said [word]. What does that actually look like in practice? Give me a sentence that sounds like [word]."

→ Emit section: brand-personality

[REFERENCE POINTS — steal from the best]
"What brands make you think 'damn, they nailed their voice'? Any industry, not just yours."

"What specifically about [brand] works? Is it the vocabulary? The rhythm? The confidence? The humor?"

[THE CRINGE TEST — find the edges]
"Now the opposite. What's the cringiest thing a brand in your space says? The stuff that makes you physically recoil."

"What words or phrases are permanently banned? Things you'd fire someone for putting in a tweet?"

→ Emit section: voice-guardrails

[SPECTRUM MAPPING — place them precisely]
"Let me run some quick either/or's. Are you more Wikipedia or group chat? More New Yorker or Twitter thread? More TED talk or podcast conversation?"

"When you're explaining something technical, who do you want to sound like — a professor, a smart friend, or a tweet thread?"

→ Emit section: formality-spectrum

[EMOTIONAL RANGE — test the edges]
"Your brand has to deliver bad news — a delay, a price increase, a screw-up. How do you say it? What's the tone?"

"Now flip it — you're celebrating a big win. What does that sound like? Are you popping champagne or doing a subtle fist pump?"

→ Emit section: tone-mapping

[PRACTICAL — make it concrete]
"Give me a 'DO say' and 'DON'T say' example. Like, a customer asks for help — what's the good version vs the bad version?"

→ Emit section: do-dont-examples

[WRAP]
"Your brand voice is essentially: [summary]. That feel right? Anything that made you go 'eh, not quite'?"

[ALTERNATIVE ANGLES]
- "If your brand had a Spotify playlist, what's the first three songs?"
- "What comedian or author writes closest to how you want to sound?"
- "Your intern just wrote a social post. What's the ONE note you'd give?"
- "Do you use exclamation marks? This says more about brand voice than you'd think."
```

### Module: Brand Persona

```
MODULE: Persona Development
SECTIONS TO FILL: persona-profile, pain-points, language-patterns, current-alternatives, motivation-triggers
ESTIMATED TIME: 6 minutes

QUESTION FLOW:

[MAKE IT REAL — no demographics allowed]
"Let's build a human. Not a segment — a person. Give me a first name. What do they do for work?"

"Walk me through their morning. They wake up, then what? What's the first thing they check? What frustrates them before lunch?"

→ Emit section: persona-profile

[FIND THE PAIN — go specific]
"What's the thing that makes them say 'there HAS to be a better way'? The specific moment of frustration."

"When they vent about this to a coworker or friend, what exact words do they use? Not your marketing words — their words."

→ Emit section: pain-points

[LANGUAGE MINING — their vocabulary, not yours]
"What do they Google at midnight when they're fed up? Give me the actual search query."

"What subreddits are they on? What YouTube rabbit holes do they go down?"

"When they describe your type of product to someone, what do they call it? Not what YOU call it."

→ Emit section: language-patterns

[CURRENT BEHAVIOR — what you're replacing]
"How are they dealing with this problem right now? What's the janky workaround?"

"What have they tried before that didn't work? Why didn't it stick?"

→ Emit section: current-alternatives

[PSYCHOLOGY — what triggers action]
"What would finally make them try something new? What's the breaking point moment?"

"And what would make them NOT buy? What's the instant red flag?"

"Who do they want to become? Not related to your product — just as a person."

→ Emit section: motivation-triggers

[WRAP]
"Okay here's the persona: [summary]. Does this sound like a real person you've actually talked to?"

[ALTERNATIVE ANGLES]
- "If this person had a bumper sticker, what would it say?"
- "They just found your product. What's the first thing they text a friend?"
- "What's their guilty pleasure app? The one they spend too much time on?"
- "Are they an early adopter or a skeptic? Do they read reviews or just buy?"
```

### Module: Vision & Values

```
MODULE: Vision & Values
SECTIONS TO FILL: vision-statement, mission-statement, core-principles, guardrails, brand-promise
ESTIMATED TIME: 7 minutes

QUESTION FLOW:

[DREAM BIG — make them feel the future]
"Five years from now, you've absolutely nailed it. Like, magazine-cover nailed it. What does the world look like? What changed because you existed?"

"Love that. Now zoom way in — what does a random Tuesday afternoon look like at your company when you've won?"

→ Emit section: vision-statement

[MISSION — daily commitment]
"That's where you're going. What do you do every single day to get there? If you had to print one sentence on the office wall — what is it?"

"Is that what it actually says? Or is that what you want it to say? I need the real version."

→ Emit section: mission-statement

[VALUES — with teeth]
"What principles does your team actually operate on? Not the poster on the wall — the ones that affect real decisions."

"Prove it. Give me a time when one of those values cost you something. Money, a deal, a hire, a feature. If it never cost you anything, it's not a real value."

"What about the ones you wish you lived by but don't yet? That's interesting too."

→ Emit section: core-principles

[THE NO LIST — define by what you refuse]
"What would you never do, even if it made you a ton of money? Like, the phone rings, someone waves a check — what makes you say no?"

"What decision would you make differently than your competitors because of what you believe?"

→ Emit section: guardrails

[BRAND PROMISE — the sacred contract]
"What do you promise your customers that you'd bet the company on? Not a product feature — a relationship commitment."

"If you broke that promise, what would happen? Would they leave? Would they forgive you? How fast?"

→ Emit section: brand-promise

[WRAP]
"Here's what I got: Your vision is [X], mission is [Y], and you'd never [Z]. That's a brand with some spine. Anything feel off?"

[ALTERNATIVE ANGLES]
- "What hill would you die on in your industry?"
- "What's the most controversial opinion you hold about your space?"
- "If a journalist wrote a headline about your company, what do you want it to say?"
- "What's the thing your team argues about the most?"
```

---

## Output File Templates

When a session completes and the user clicks "Download Files," a zip is generated with structured markdown files. These files are designed to be dropped directly into an AI agent's context.

### Zip Structure

```
{brand-name}-{module}/
├── README.md
├── {module-slug}.md
└── metadata.yaml
```

### README.md Template

```markdown
# {Brand Name} — {Module Title}

Generated by [Imprint](https://useimprint.com) on {date}

## What's in this folder

Structured brand files from your {module title} session with {agent name}. Drop these into your AI coding tool (Claude Code, Cursor, Windsurf, etc.) and your AI will understand your brand.

## How to use

1. Add this folder to your project or AI tool's context
2. Reference in prompts: "Follow the brand guidelines in /brand/"
3. AI will use these as guardrails for all brand-related output

## Session Info

- **Agent:** {agent name}
- **Date:** {date}
- **Duration:** {MM:SS}
- **Module:** {module title}
```

### brand-positioning.md Template

```markdown
---
type: brand-positioning
brand: "{brand_name}"
generated: "{ISO date}"
agent: "{agent}"
session_id: "{uuid}"
version: 1
---

# Brand Positioning — {Brand Name}

## Company Overview

{2-3 sentences: what the company does, core offering, who it's for.}

## The Core Problem

{The specific customer pain being solved. Written from the customer's POV. Not the company's solution pitch.}

## Unique Value Proposition

{The "only we" statement. Specific enough that no competitor could say the same.}

## Target Audience

**Primary persona:** {Name/archetype}
**Role:** {Job title or situation}
**Core frustration:** {One-line pain}
**Current workaround:** {What they do today}

## Competitive Landscape

| Competitor | Their Approach | What They Miss |
|-----------|---------------|----------------|
| {Name} | {Strategy} | {Gap} |
| {Name} | {Strategy} | {Gap} |

## Positioning Statement

> For {audience} who {pain}, {brand} is the {category} that {benefit} because {reason}.

## Key Differentiators

1. **{Differentiator}:** {Explanation}
2. **{Differentiator}:** {Explanation}
3. **{Differentiator}:** {Explanation}
```

### voice-tone.md Template

```markdown
---
type: voice-tone
brand: "{brand_name}"
generated: "{ISO date}"
agent: "{agent}"
session_id: "{uuid}"
version: 1
---

# Voice & Tone — {Brand Name}

## Brand Personality

**In three words:** {word}, {word}, {word}
**Never:** {word}, {word}, {word}
**Character:** {If this brand were a person — 1-2 sentences}

## Tone Mapping

| Context | Tone | Example |
|---------|------|---------|
| Marketing | {desc} | "{example}" |
| Support | {desc} | "{example}" |
| Social | {desc} | "{example}" |
| Errors | {desc} | "{example}" |
| Wins | {desc} | "{example}" |

## Formality Spectrum

**Position:** {e.g., "Smart casual — contractions always, first person, no jargon unless audience uses it first"}
**Register:** {e.g., "Smart friend explaining over coffee"}

## Voice Guardrails

**Always:** {list of do's}
**Never:** {list of don'ts}

## Do / Don't Examples

| ❌ Don't | ✅ Do |
|----------|------|
| "{bad}" | "{good}" |
| "{bad}" | "{good}" |

## References

Voices that feel adjacent: {brands}
What to borrow: {quality}
```

### brand-persona.md Template

```markdown
---
type: brand-persona
brand: "{brand_name}"
generated: "{ISO date}"
agent: "{agent}"
session_id: "{uuid}"
version: 1
---

# Brand Persona — {Brand Name}

## {Persona Name}

**Role:** {title/situation}
**Age range:** {range}

### Day in Their Life
{2-3 sentence narrative}

### Pain Points
1. **{Pain}:** {Detail}
2. **{Pain}:** {Detail}
3. **{Pain}:** {Detail}

### Language They Use
- "{Exact phrase}"
- "{Exact phrase}"
- Googles: "{query}", "{query}"

### Current Workarounds
| Current Solution | Why It Falls Short |
|-----------------|-------------------|
| {Alt} | {Gap} |
| {Alt} | {Gap} |

### Triggers & Motivations
**Breaking point:** {moment}
**Aspiration:** {who they want to become}
**Deal breaker:** {red flag}
**Trust signals:** {what makes them buy}
```

### vision-values.md Template

```markdown
---
type: vision-values
brand: "{brand_name}"
generated: "{ISO date}"
agent: "{agent}"
session_id: "{uuid}"
version: 1
---

# Vision & Values — {Brand Name}

## Vision
> {What the world looks like when you've won.}

## Mission
> {What you do every day to get there.}

## Core Principles

### 1. {Principle}
{What it means + real example of when it cost something}

### 2. {Principle}
{Meaning + example}

### 3. {Principle}
{Meaning + example}

## Guardrails — What We Never Do
1. **{Line}** — {Why + what we do instead}
2. **{Line}** — {Why}

## Brand Promise
> {The one thing customers can always count on.}

**Stakes:** {What happens if this promise breaks}
```

### metadata.yaml Template

```yaml
brand: "{brand_name}"
module: "{module_slug}"
agent: "{agent_name}"
session_id: "{uuid}"
generated: "{ISO_8601_date}"
duration_seconds: {number}
sections_completed: {number}
imprint_version: "1.0.0"
```

---

## Export Logic

```typescript
// lib/export.ts
import JSZip from 'jszip';

interface ExportSession {
  id: string;
  brand_name: string;
  module: string;
  agent: string;
  duration_seconds: number;
  document: Record<string, { title: string; content: string }>;
  created_at: string;
}

export async function generateExportZip(session: ExportSession): Promise<Blob> {
  const zip = new JSZip();
  const slug = slugify(session.brand_name);
  const folderName = `${slug}-${session.module}`;
  const folder = zip.folder(folderName)!;

  // README
  folder.file('README.md', buildReadme(session));

  // Module markdown — fill template with session.document sections
  const moduleContent = buildModuleFile(session);
  folder.file(`${session.module}.md`, moduleContent);

  // Metadata
  folder.file('metadata.yaml', buildMetadata(session));

  return zip.generateAsync({ type: 'blob' });
}

function buildModuleFile(session: ExportSession): string {
  const frontmatter = `---
type: ${session.module}
brand: "${session.brand_name}"
generated: "${session.created_at}"
agent: "${session.agent}"
session_id: "${session.id}"
version: 1
---\n\n`;

  // Get the right template and fill sections from session.document
  const sections = Object.entries(session.document)
    .map(([slug, data]) => `## ${data.title}\n\n${data.content}`)
    .join('\n\n');

  const moduleTitle = {
    'positioning': 'Brand Positioning',
    'voice-tone': 'Voice & Tone',
    'persona': 'Brand Persona',
    'vision-values': 'Vision & Values',
  }[session.module] || session.module;

  return frontmatter + `# ${moduleTitle} — ${session.brand_name}\n\n` + sections;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function downloadZip(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

## Ambient Audio Component

```typescript
// components/AmbientAudio.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useSessionStore } from '@/lib/session-store';

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { state, audioEnabled } = useSessionStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === 'idle' && audioEnabled) {
      audio.volume = 0;
      audio.play().catch(() => {});
      // Fade in
      const fade = setInterval(() => {
        if (audio.volume < 0.25) audio.volume = Math.min(audio.volume + 0.01, 0.25);
        else clearInterval(fade);
      }, 80);
      return () => clearInterval(fade);
    } else {
      // Fade out
      const fade = setInterval(() => {
        if (audio.volume > 0.01) audio.volume = Math.max(audio.volume - 0.02, 0);
        else { audio.pause(); clearInterval(fade); }
      }, 50);
      return () => clearInterval(fade);
    }
  }, [state, audioEnabled]);

  return <audio ref={audioRef} src="/audio/ambient-idle.mp3" loop preload="auto" />;
}
```

**Sourcing the audio:** Download a free dark ambient loop from Pixabay.com (search "dark ambient drone"). Trim to 60 seconds, export as mono MP3 at 64kbps (~480KB). Place at `public/audio/ambient-idle.mp3`.

---

## Zustand Session Store

```typescript
// lib/session-store.ts
import { create } from 'zustand';

type AppState = 'idle' | 'active' | 'complete';
type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';

interface SectionData {
  title: string;
  content: string;
}

interface SessionStore {
  state: AppState;
  setState: (s: AppState) => void;

  selectedAgent: string;
  selectedModules: string[];
  setAgent: (a: string) => void;
  toggleModule: (m: string) => void;

  sessionId: string | null;
  brandName: string;
  setBrandName: (n: string) => void;
  micState: MicState;
  setMicState: (m: MicState) => void;
  elapsedSeconds: number;
  tick: () => void;

  sections: Record<string, SectionData>;
  addSection: (slug: string, data: SectionData) => void;
  updateSection: (slug: string, content: string) => void;

  audioEnabled: boolean;
  toggleAudio: () => void;

  reset: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  state: 'idle',
  setState: (s) => set({ state: s }),

  selectedAgent: 'strategist',
  selectedModules: ['positioning'],
  setAgent: (a) => set({ selectedAgent: a }),
  toggleModule: (m) => set((s) => ({
    selectedModules: s.selectedModules.includes(m)
      ? s.selectedModules.filter((x) => x !== m)
      : [...s.selectedModules, m],
  })),

  sessionId: null,
  brandName: '',
  setBrandName: (n) => set({ brandName: n }),
  micState: 'READY',
  setMicState: (m) => set({ micState: m }),
  elapsedSeconds: 0,
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  sections: {},
  addSection: (slug, data) => set((s) => ({
    sections: { ...s.sections, [slug]: data },
  })),
  updateSection: (slug, content) => set((s) => ({
    sections: {
      ...s.sections,
      [slug]: { ...s.sections[slug], content },
    },
  })),

  audioEnabled: true,
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

  reset: () => set({
    state: 'idle',
    selectedAgent: 'strategist',
    selectedModules: ['positioning'],
    sessionId: null,
    brandName: '',
    micState: 'READY',
    elapsedSeconds: 0,
    sections: {},
  }),
}));
```

---

## TypeScript Interfaces

```typescript
// types/index.ts
export interface Session {
  id: string;
  user_id: string;
  brand_name: string;
  module: 'positioning' | 'voice-tone' | 'persona' | 'vision-values';
  agent: 'strategist' | 'creative' | 'coach';
  status: 'active' | 'completed' | 'paused';
  duration_seconds: number;
  transcript: TranscriptEntry[];
  document: Record<string, SectionData>;
  created_at: string;
  updated_at: string;
}

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SectionData {
  title: string;
  content: string;
  captured_at?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  subtitle: string;
  systemPrompt: string;
}

export interface ModuleConfig {
  id: string;
  name: string;
  duration: string;
  sections: string[];
  questionFlow: string;
}
```

---

## Design Tokens (Quick Reference)

```css
/* Backgrounds */
--bg-main: #131313;
--bg-avatar: #0f0f0f;
--bg-sidebar: #020607;
--bg-card: #1c1c1c;
--bg-nav: #010506;
--bg-input: #2f2f2f;

/* Text */
--text-primary: #ededed;
--text-secondary: #8e8e93;
--text-tertiary: #525252;

/* Accent */
--accent-amber: #d97706;
--accent-green: #46a758;
--accent-red: #dc2626;

/* Borders */
--border-default: #2a2a2a;
--border-hover: #3f3f3f;
--border-strong: #333;

/* Fonts */
--font-heading: 'Fraunces', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-accent: Georgia, serif;

/* Radii */
--radius-card: 12px;
--radius-agent: 24px;
--radius-pill: 999px;
--radius-checkbox: 4px;
--radius-button: 46px;
```

---

## Nav Bar

Fixed top, 56px, #010506 bg, border-bottom 1px #2a2a2a.

- Left: Logo mark (small icon, 18px) + "Imprint" (Inter 15.2px semibold, #ededed, tracking -0.152px)
- Right: "Sessions" (Inter 13.6px medium, #8e8e93, clickable → /sessions) + "Settings" (same) + Avatar circle (28px, #333 bg, border 1px #444, rounded-14px)
- Nav links have 20px gap between them

---

## Build Order

1. **Scaffold** — `npx create-next-app@latest imprint --typescript --tailwind --app`, install deps
2. **Layout + Nav** — Root layout with dark bg, nav bar component
3. **Two-panel layout** — Avatar panel (left 76.5%) + sidebar (right 23.5%), full viewport height minus nav
4. **Idle state** — Config panel: agent cards, module checkboxes, start button, CSS avatar glow
5. **Ambient audio** — Background music on idle with fade in/out + toggle
6. **Session flow** — Start button → mic permission → connect ElevenLabs (or fallback) → active state
7. **Mic indicator** — Floating pill state machine with visual transitions
8. **Live document** — Parse section_update blocks → render with typing animation + shimmer
9. **Session complete** — Show all sections, download button
10. **Export** — JSZip generation from session data, trigger download
11. **Sessions page** — `/sessions` with cards listing past sessions
12. **Supabase** — Auth + session persistence + realtime (can skip for pure demo)

**For MVP demo**: Steps 1-11 work with local state + mocked past sessions. Step 12 adds persistence.

---

## Quick Start

```bash
npx create-next-app@latest imprint --typescript --tailwind --app --src-dir=false
cd imprint
npm install zustand jszip @11labs/client
npm install @anthropic-ai/sdk   # for fallback chat
```

---

## MVP Scope

### Build This
- [x] Voice conversation with AI (ElevenLabs or browser fallback)
- [x] 4 modules with full question scripts
- [x] 3 agent personas with distinct system prompts
- [x] Live document streaming during session
- [x] Zip export with structured markdown files (templates above)
- [x] Sessions history page
- [x] Ambient background audio on idle
- [x] Dark ethereal UI from design specs above

### Skip This
- User auth (password gate or skip)
- Tiptap post-editing (show read-only doc)
- Rive avatar (CSS glow placeholder)
- Multiple brands
- Payments
- Mobile responsive
- Settings page

---

*This is the single source of truth. Build exactly this. Ship it.*
