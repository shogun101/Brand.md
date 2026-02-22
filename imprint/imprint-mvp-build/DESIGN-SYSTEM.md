# Imprint Design System

> **Brand:** Imprint
> **Aesthetic:** Dark, cinematic, editorial
> **Mood:** Premium AI tooling with a human-centered, warm-dark sensibility
> **Source:** Figma — Study Design (node `576:1660`)

---

## 1. Color System

### Brand Palette

The palette is anchored in near-black tones with subtle warm undertones, designed for extended screen use without harshness.

| Token              | Hex       | Role                           | Tailwind Class       |
|--------------------|-----------|--------------------------------|----------------------|
| `brand-dark`       | `#010506` | Page background, navbar        | `bg-brand-dark`      |
| `brand-surface`    | `#020607` | Sidebar / card base surface    | `bg-brand-surface`   |
| `brand-panel`      | `#0f0f0f` | Hero panel background          | `bg-brand-panel`     |
| `brand-sidebar`    | `#1c1c1c` | Alternative surface tone       | `bg-brand-sidebar`   |
| `brand-accent`     | `#d97706` | Amber accent (active states)   | `text-brand-accent`  |
| `brand-success`    | `#46a758` | Green (audio visualizer active)| `bg-brand-success`   |

### Neutral Palette

A 10-step grayscale optimized for dark UI — higher numbers are darker.

| Token          | Hex       | Usage                                  | Tailwind Class       |
|----------------|-----------|----------------------------------------|----------------------|
| `neutral-50`   | `#ededed` | Primary text, active nav links         | `text-neutral-50`    |
| `neutral-100`  | `#d4d4d4` | Bright secondary text                  | `text-neutral-100`   |
| `neutral-200`  | `#8e8e93` | Secondary text, subtitles, muted labels| `text-neutral-200`   |
| `neutral-300`  | `#525252` | Section labels, unchecked borders      | `text-neutral-300`   |
| `neutral-400`  | `#444444` | Avatar borders, divider accents        | `border-neutral-400` |
| `neutral-500`  | `#3f3f3f` | Mid-range UI elements                  | `bg-neutral-500`     |
| `neutral-600`  | `#333333` | Hover borders, floating bar borders    | `border-neutral-600` |
| `neutral-700`  | `#2f2f2f` | Badge backgrounds                      | `bg-neutral-700`     |
| `neutral-800`  | `#2a2a2a` | Dividers, card borders, navbar border  | `border-neutral-800` |
| `neutral-900`  | `#131313` | Deep background accents                | `bg-neutral-900`     |

### Opacity-Based Colors

Used for glassmorphism and subtle hover states:

| Value                        | Usage                              |
|------------------------------|------------------------------------|
| `rgba(255, 255, 255, 0.30)`  | Selected card border               |
| `rgba(255, 255, 255, 0.20)`  | Selected card inner gradient border|
| `rgba(255, 255, 255, 0.16)`  | Audio bar inactive fill            |
| `rgba(255, 255, 255, 0.02)`  | Module row hover background        |
| `rgba(237, 237, 237, 0.72)`  | Muted agent name text              |
| `rgba(37, 37, 37, 0.67)`    | Floating bar backdrop              |
| `rgba(0, 0, 0, 0.70)`       | Card gradient bottom               |
| `rgba(0, 0, 0, 0.50)`       | Floating bar shadow                |
| `rgba(0, 0, 0, 0.20)`       | Button shadow                      |

---

## 2. Typography

### Font Families

| Font            | Stack                                        | Role                        | Tailwind Class       |
|-----------------|----------------------------------------------|-----------------------------|----------------------|
| Awesome Serif   | `"Awesome Serif", Georgia, "Times New Roman", serif` | Headlines, CTA buttons | `font-awesome-serif` |
| Inter           | `"Inter", system-ui, -apple-system, sans-serif`      | Body, labels, UI text  | `font-inter`         |

### Awesome Serif — Weights & Styles

Available in both **upright** and **italic** variants:

| Weight | Name     | Tailwind        | File (Upright)                     | File (Italic)                         |
|--------|----------|-----------------|------------------------------------|---------------------------------------|
| 300    | Light    | `font-light`    | `AwesomeSerif-LightRegular.otf`   | `AwesomeSerifItalic-LightReg.otf`    |
| 400    | Regular  | `font-normal`   | `AwesomeSerif-Regular.otf`        | `AwesomeSerifItalic-Regular.otf`     |
| 500    | Medium   | `font-medium`   | `AwesomeSerif-MediumRegular.otf`  | `AwesomeSerifItalic-MedRegular.otf`  |
| 600    | SemiBold | `font-semibold` | `AwesomeSerif-SemiBoldRegular.otf`| `AwesomeSerifItalic-SmRegular.otf`   |

### Type Scale

| Element               | Font           | Size     | Weight   | Line Height | Letter Spacing | Tailwind Classes                                                                 |
|-----------------------|----------------|----------|----------|-------------|----------------|----------------------------------------------------------------------------------|
| Page headline (h1)    | Awesome Serif  | 32px     | 400      | 1.0         | +0.64px        | `font-awesome-serif text-[32px] font-normal leading-none tracking-[0.64px]`      |
| Body paragraph        | Inter          | 14.4px   | 400      | 21.6px      | normal         | `font-inter text-[14.4px] font-normal leading-[21.6px]`                          |
| Section label         | Inter          | 11.2px   | 600      | normal      | +0.56px        | `font-inter text-[11.2px] font-semibold uppercase tracking-[0.56px]`             |
| Nav brand name        | Inter          | 15.2px   | 600      | normal      | -0.152px       | `font-inter text-[15.2px] font-semibold tracking-[-0.152px]`                     |
| Nav link              | Inter          | 13.6px   | 500      | normal      | normal         | `font-inter text-[13.6px] font-medium`                                           |
| Agent card name       | Inter          | 13.6px   | 600      | normal      | normal         | `font-inter text-[13.6px] font-semibold`                                         |
| Agent card role       | Inter          | 11.2px   | 400      | normal      | +0.56px        | `font-inter text-[11.2px] font-normal uppercase tracking-[0.56px]`               |
| Module label          | Inter          | 14.4px   | 400      | normal      | normal         | `font-inter text-[14.4px] font-normal`                                           |
| Duration badge        | Inter          | 12px     | 400      | normal      | normal         | `font-inter text-xs font-normal`                                                 |
| Floating bar agent    | Inter          | 13.6px   | 600      | normal      | normal         | `font-inter text-[13.6px] font-semibold`                                         |
| CTA button (main)     | Awesome Serif  | 16px     | 400      | normal      | normal         | `font-awesome-serif text-base`                                                   |
| CTA button (mini)     | Awesome Serif  | 12px     | 400      | normal      | normal         | `font-awesome-serif text-xs`                                                     |

### Typography Rules

1. **Headlines** always use Awesome Serif upright (not italic), weight 400
2. **CTA buttons** use Awesome Serif for editorial warmth
3. **All UI text** (labels, body, badges, nav) uses Inter
4. **Section labels** are always uppercase with `tracking-[0.56px]`
5. **Letter spacing** is positive for display text, negative for brand name
6. Italic Awesome Serif is available but reserved for emphasis only

---

## 3. Spacing

### Base Unit

Spacing is based on a **4px grid** with common multiples:

| Value | Pixels | Usage                                    | Tailwind    |
|-------|--------|------------------------------------------|-------------|
| 1     | 4px    | Module row gap                           | `gap-1`     |
| 2     | 8px    | Floating bar vertical padding            | `py-2`      |
| 3     | 12px   | Agent card gap, section label gap        | `gap-3`     |
| 4     | 16px   | Floating bar horizontal padding          | `pl-4`      |
| 5     | 20px   | Nav link gap                             | `gap-5`     |
| 6     | 24px   | Nav horizontal padding                   | `px-6`      |
| 8     | 32px   | Sidebar padding, floating bar offset     | `p-8`, `bottom-8` |
| 10    | 40px   | —                                        | `gap-[10px]`|
| 12    | 48px   | Section spacing (min gap between groups) | `gap-12`    |

### Layout Spacing Pattern

The sidebar uses a dual-strategy for vertical spacing:

- **Tall viewports:** `justify-between` pushes bottom group to the bottom edge
- **Short viewports:** `gap-12` (48px) ensures minimum separation, content scrolls via `overflow-y-auto`

---

## 4. Border & Radius

### Border Widths

All borders are **1px solid**.

### Border Radius Scale

| Radius     | Pixels | Usage                          | Tailwind        |
|------------|--------|--------------------------------|-----------------|
| `rounded`  | 4px    | Checkboxes                     | `rounded`       |
| `rounded-md`| 6px   | Module row hover               | `rounded-md`    |
| `rounded-3xl`| 24px | Agent cards                    | `rounded-3xl`   |
| `rounded-full`| 9999px| Floating bar, CTA buttons, avatar | `rounded-full` |
| Custom     | 46px   | Main CTA button                | `rounded-[46px]`|
| Custom     | 2px    | Audio level bars               | `rounded-[2px]` |

### Border Colors by Context

| Context              | Default          | Hover            | Selected/Active      |
|----------------------|------------------|------------------|----------------------|
| Navbar bottom        | `neutral-800`    | —                | —                    |
| Hero panel right     | `neutral-800`    | —                | —                    |
| Agent card           | `neutral-800`    | `neutral-600`    | `white/30`           |
| Floating bar         | `neutral-600`    | —                | —                    |
| Checkbox             | `neutral-300`    | —                | `white` (filled)     |
| Duration badge       | `neutral-800`    | —                | —                    |
| CTA button           | `white`          | —                | —                    |

---

## 5. Shadows & Effects

### Box Shadows

| Name                | Value                                    | Usage                    |
|---------------------|------------------------------------------|--------------------------|
| Floating bar shadow | `0px 10px 40px 0px rgba(0,0,0,0.5)`     | Floating bar container   |
| Button shadow       | `0px 2px 4px 0px rgba(0,0,0,0.2)`       | Mini CTA button          |
| Selected card glow  | `0 0 20px rgba(255,255,255,0.08)`        | Agent card selected state|

### Backdrop Blur

| Value              | Usage               |
|--------------------|----------------------|
| `backdrop-blur-[6px]` | Floating bar     |
| `backdrop-blur-[1px]` | Agent card gradient overlay |

### Glassmorphism Recipe

The floating bar is the primary glassmorphism element:

```
background: rgba(37, 37, 37, 0.67)
border: 1px solid #333333
backdrop-filter: blur(6px)
box-shadow: 0px 10px 40px 0px rgba(0,0,0,0.5)
border-radius: 9999px (full pill)
```

---

## 6. Iconography & Micro-Elements

### Checkmark Icon

- **Viewbox:** 16 x 16
- **Stroke:** `black`, width `2`, round caps and joins
- **Path:** `M4 8.5L6.5 11L12 5.5`
- **Visibility:** Hidden when unchecked, shown via `peer-checked:opacity-100`

### Audio Level Bars

- **Count:** 4 bars
- **Width:** 3px each
- **Height:** 8px (static; animate to varying heights when connected to audio)
- **Gap:** 3px
- **Fill:** `rgba(255, 255, 255, 0.16)` (inactive)
- **Active fill:** `brand-success` (#46a758) *(when audio is active)*
- **Border radius:** 2px

### Avatar Placeholder

- **Size:** 28 x 28px
- **Shape:** Circle (`rounded-full`)
- **Border:** 1px `neutral-400`
- **Fill:** `neutral-600`

### Logo Mark

- **Size:** 18 x 18px
- **Format:** SVG
- **Color:** White/light (inherits from SVG source)

---

## 7. Component Patterns

### Cards (Agent Card)

```
Dimensions:    120 x 137px
Border radius: 24px (rounded-3xl)
Border:        1px solid
Background:    Image layer + gradient overlay
Text position: Bottom-left, 16px from bottom, 11px from left
Gradient:      linear-gradient(to bottom, transparent → rgba(0,0,0,0.7))
```

**States:**
- Default: `border-neutral-800`, muted text `rgba(237,237,237,0.72)`
- Hover: `border-neutral-600`
- Selected: `border-white/30`, glow shadow, bright text `neutral-50`

### Buttons (CTA)

**Primary CTA (Start Session — sidebar):**
```
Height:        48px (h-12)
Width:         100% of parent
Border radius: 46px
Background:    neutral-50 (#ededed)
Text:          black, Awesome Serif, 16px
Border:        1px solid white
Hover:         opacity 90%
```

**Mini CTA (Start Session — floating bar):**
```
Height:        32px (h-8)
Padding:       0 12px
Border radius: 9999px (full)
Background:    neutral-50 (#ededed)
Text:          black, Awesome Serif, 12px
Shadow:        0px 2px 4px rgba(0,0,0,0.2)
Hover:         opacity 90%
```

### List Items (Module Row)

```
Padding:       11px vertical, 13px horizontal
Border:        1px solid transparent (reserve space)
Border radius: 6px (rounded-md)
Hover:         bg white/2% (rgba(255,255,255,0.02))
Gap:           12px between checkbox and label
```

### Badges (Duration)

```
Height:        20px
Padding:       0 6px
Border radius: default (4px)
Background:    neutral-700 (#2f2f2f)
Border:        1px solid neutral-800 (#2a2a2a)
Text:          neutral-200, Inter, 12px, normal weight
```

---

## 8. Layout Architecture

### Page Structure

```
┌──────────────────────────────────────────────────────────┐
│ Navbar         height: 56px    bg: brand-dark            │
│                border-bottom: 1px neutral-800            │
├─────────────────────────────┬────────────────────────────┤
│                             │                            │
│  Hero Panel (flex-1)        │  Sidebar (448px fixed)     │
│  bg: brand-panel            │  bg: brand-surface         │
│  border-right: neutral-800  │  padding: 32px all sides   │
│                             │  overflow-y: auto          │
│                             │                            │
└─────────────────────────────┴────────────────────────────┘
```

### Key Dimensions

| Element           | Value        | Note                            |
|-------------------|--------------|---------------------------------|
| Navbar height     | 56px         | Fixed                           |
| Sidebar width     | 448px        | Fixed, `shrink-0`               |
| Hero panel width  | `flex-1`     | Fills remaining space           |
| Sidebar padding   | 32px (p-8)   | All sides                       |
| Figma canvas      | 1907 x 901px | Reference only                  |
| Floating bar offset| 32px from bottom | `bottom-8`                 |

### Sidebar Internal Layout

```
<aside> — flex-col, justify-between, gap-12, overflow-y-auto

  ┌─ TOP GROUP (flex-col, gap-12) ─────────────────────┐
  │                                                     │
  │  Headline (h1) + Subtitle (p)                       │
  │    gap: 10px between h1 and p                       │
  │                                                     │
  │  Modules Section                                    │
  │    Section label (h2)                               │
  │    Module rows (gap: 4px)                           │
  │                                                     │
  └─────────────────────────────────────────────────────┘

              ↕ justify-between (or min 48px gap)

  ┌─ BOTTOM GROUP (flex-col, gap-12) ──────────────────┐
  │                                                     │
  │  Agent Section                                      │
  │    Section label (h2)                               │
  │    Agent cards row (gap: 12px)                      │
  │                                                     │
  │  Start Session CTA (full width)                     │
  │                                                     │
  └─────────────────────────────────────────────────────┘
```

---

## 9. Interaction States

| Element          | Default                      | Hover                        | Selected / Active             |
|------------------|------------------------------|------------------------------|-------------------------------|
| Agent Card       | `border-neutral-800`         | `border-neutral-600`         | `border-white/30` + glow     |
| Module Checkbox  | `border-neutral-300`         | Row: `bg-white/2%`           | `bg-white`, checkmark: black |
| CTA Button       | `bg-neutral-50`, text black  | `opacity-90%`                | —                            |
| Floating Bar CTA | `bg-neutral-50`, text black  | `opacity-90%`                | —                            |
| Nav Links        | `text-neutral-200`           | `text-neutral-50`            | `text-neutral-50`            |
| Module Row       | `bg-transparent`             | `bg-white/[0.02]`           | —                            |

### Transition Defaults

- **Colors/borders:** `transition-colors` (150ms ease)
- **All properties:** `transition-all` (150ms ease) — used on agent cards
- **Opacity:** `transition-opacity` (150ms ease) — used on CTA buttons

---

## 10. Image Treatment

### Hero Panel Layering

Two image layers stacked with absolute positioning:

1. **Base layer** (`hero-figure.png`): Slightly oversized (`width: 103.7%`) and offset (`left: -1.88%`) for full-bleed effect
2. **Glow overlay** (`hero-overlay.png`): Full-size cover, purely decorative (`aria-hidden`)

### Agent Card Image Pattern

- Background image fills card via `object-cover`
- Optional overlay image for selected-state glow
- Gradient overlay: `bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.7)]`
- Subtle backdrop blur: `backdrop-blur-[1px]`

---

## 11. Scrollbar Styling

Custom scrollbar for the sidebar (WebKit-based):

```css
/* Track */
width: 4px
background: transparent

/* Thumb */
background: #2a2a2a (neutral-800)
border-radius: 2px

/* Thumb hover */
background: #333333 (neutral-600)
```

Applied via `.custom-scrollbar` utility class.

---

## 12. Design Principles

1. **Near-black, not pure black** — Background colors use `#010506` / `#020607` rather than `#000000`, creating depth without harshness
2. **Warm opacity** — White-based opacity values (`white/30`, `white/20`, `white/2%`) create layered depth
3. **Editorial typography** — Awesome Serif adds warmth and distinction to headlines and CTAs, contrasting the clean Inter UI text
4. **Minimal borders** — Borders are subtle (`neutral-800`) and only appear at structural boundaries
5. **Cinematic imagery** — Hero images use oversized, offset placement for a cinematic feel
6. **Glassmorphism as accent** — Reserved for the floating bar only, keeping it special
7. **Uppercase sparingly** — Only section labels and agent card roles use uppercase with wide tracking
8. **Consistent interaction language** — Hover always lightens borders or reduces opacity; selection adds glow/white borders

---

## 13. CSS Custom Properties Reference

All tokens are defined in `src/index.css` via Tailwind's `@theme` directive and are available as CSS custom properties:

```css
/* Fonts */
var(--font-awesome-serif)
var(--font-inter)

/* Brand Colors */
var(--color-brand-dark)
var(--color-brand-surface)
var(--color-brand-panel)
var(--color-brand-sidebar)
var(--color-brand-accent)
var(--color-brand-success)

/* Neutral Palette */
var(--color-neutral-50)
var(--color-neutral-100)
var(--color-neutral-200)
var(--color-neutral-300)
var(--color-neutral-400)
var(--color-neutral-500)
var(--color-neutral-600)
var(--color-neutral-700)
var(--color-neutral-800)
var(--color-neutral-900)
```

---

*Generated from Figma source: Study Design — node 576:1660*
