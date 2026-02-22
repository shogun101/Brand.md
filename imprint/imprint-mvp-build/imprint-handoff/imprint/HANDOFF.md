# Imprint — Frontend Code Handoff

> **Figma source:** [Study Design — node 576:1660](https://www.figma.com/design/sbUcVWzkYwilZceyKjB6Us/Study-design?node-id=576-1660&m=dev)
> **Screen:** Brand-builder landing page ("1907w default")
> **Stack:** React 19 + Vite 7 + Tailwind CSS 4

---

## 1. Quick Start

```bash
cd ~/imprint
npm install
npm run dev          # → http://localhost:5173
npm run build        # → dist/
```

---

## 2. Project Structure

```
imprint/
├── public/
├── src/
│   ├── assets/
│   │   ├── fonts/                                # Awesome Serif — all weights included
│   │   │   ├── AwesomeSerif-Regular.otf          # Upright 400
│   │   │   ├── AwesomeSerif-LightRegular.otf     # Upright 300
│   │   │   ├── AwesomeSerif-MediumRegular.otf    # Upright 500
│   │   │   ├── AwesomeSerif-SemiBoldRegular.otf  # Upright 600
│   │   │   ├── AwesomeSerifItalic-Regular.otf    # Italic 400
│   │   │   ├── AwesomeSerifItalic-LightReg.otf   # Italic 300
│   │   │   ├── AwesomeSerifItalic-MedRegular.otf # Italic 500
│   │   │   └── AwesomeSerifItalic-SmRegular.otf  # Italic 600
│   │   └── images/
│   │       ├── hero-figure.png       # Main ethereal figure (1376×768)
│   │       ├── hero-overlay.png      # Gradient/glow overlay (2752×1536)
│   │       ├── agent-card-bg.png     # Shared agent card background (1376×768)
│   │       └── logo.svg              # Imprint logo mark
│   ├── components/
│   │   ├── Navbar.jsx                # Top navigation bar
│   │   ├── HeroPanel.jsx            # Left panel: hero image + floating bar
│   │   ├── FloatingBar.jsx          # Pill-shaped bottom bar overlay
│   │   ├── Sidebar.jsx              # Right panel: modules, agents, CTA
│   │   ├── AgentCard.jsx            # Individual agent persona card
│   │   └── ModuleItem.jsx           # Checkbox row with duration badge
│   ├── App.jsx                       # Root layout composition
│   ├── index.css                     # Tailwind imports + @font-face + design tokens
│   └── main.jsx                      # React DOM entry
├── vite.config.js
└── package.json
```

---

## 3. Design Tokens (defined in `index.css` → `@theme`)

### Fonts

| Token                  | CSS Value                            | Tailwind Class         | Usage                  |
|------------------------|--------------------------------------|------------------------|------------------------|
| `--font-awesome-serif` | `"Awesome Serif", Georgia, serif`    | `font-awesome-serif`   | Headlines, CTA buttons |
| `--font-inter`         | `"Inter", system-ui, sans-serif`     | `font-inter`           | Body, labels, UI text  |

Both upright and italic variants of Awesome Serif are registered via `@font-face`:
- **Upright:** `not-italic` (default) — used for headlines and buttons
- **Italic:** `italic` — available when needed
- **Weights:** 300 (light), 400 (regular), 500 (medium), 600 (semibold)

### Colors

| Token                  | Hex         | Tailwind Class      | Usage                           |
|------------------------|-------------|---------------------|---------------------------------|
| `--color-brand-dark`   | `#010506`   | `bg-brand-dark`     | Page background, nav bar        |
| `--color-brand-surface`| `#020607`   | `bg-brand-surface`  | Sidebar background, card base   |
| `--color-brand-panel`  | `#0f0f0f`   | `bg-brand-panel`    | Hero panel background           |
| `--color-brand-accent` | `#d97706`   | `text-brand-accent` | Amber accent (active states)    |
| `--color-brand-success`| `#46a758`   | `bg-brand-success`  | Green (audio visualizer active) |
| `--color-neutral-50`   | `#ededed`   | `text-neutral-50`   | Primary text                    |
| `--color-neutral-200`  | `#8e8e93`   | `text-neutral-200`  | Secondary text, subtitles       |
| `--color-neutral-300`  | `#525252`   | `text-neutral-300`  | Section labels, unchecked borders|
| `--color-neutral-600`  | `#333333`   | `border-neutral-600`| Borders, floating bar border    |
| `--color-neutral-800`  | `#2a2a2a`   | `border-neutral-800`| Dividers, card borders          |

---

## 4. Component API Reference

### `<Navbar />`
| Prop              | Type       | Default     | Description                 |
|-------------------|------------|-------------|-----------------------------|
| `activeLink`      | `string?`  | `undefined` | `"sessions"` or `"settings"` |
| `onSessionsClick` | `function?`| —           | Click handler for Sessions  |
| `onSettingsClick`  | `function?`| —           | Click handler for Settings  |

### `<HeroPanel />`
| Prop             | Type       | Default        | Description                       |
|------------------|------------|----------------|-----------------------------------|
| `agentName`      | `string?`  | `"STRATEGIST"` | Agent name shown in floating bar  |
| `onStartSession` | `function?`| —              | Fires on floating bar CTA click   |

### `<FloatingBar />`
| Prop             | Type       | Default        | Description                      |
|------------------|------------|----------------|----------------------------------|
| `agentName`      | `string?`  | `"STRATEGIST"` | Agent name displayed             |
| `onStartSession` | `function?`| —              | Click handler for mini CTA       |

### `<Sidebar />`
| Prop              | Type       | Default | Description                                   |
|-------------------|------------|---------|-----------------------------------------------|
| `onStartSession`  | `function?`| —       | Fires on main CTA click                      |
| `onAgentChange`   | `function?`| —       | `(agentId: string) => void`                   |
| `onModulesChange` | `function?`| —       | `(modules: Map<string, boolean>) => void`     |

**Internal state:**
- `selectedAgent` — defaults to `"strategist"`
- `modules` — `Map` of module IDs → checked boolean

**Layout behavior:**
- Uses `flex-col justify-between gap-12` on the aside
- **Tall viewports:** bottom section (agents + CTA) pins to bottom
- **Short viewports:** 48px min gap between sections, sidebar scrolls via `overflow-y-auto`

### `<AgentCard />`
| Prop       | Type       | Default | Description                               |
|------------|------------|---------|-------------------------------------------|
| `name`     | `string`   | —       | Display name (e.g. `"STRATEGIST"`)        |
| `role`     | `string`   | —       | Sub-label (e.g. `"Big Picture"`)          |
| `image`    | `string`   | —       | Background image URL                      |
| `overlay`  | `string?`  | —       | Optional second image layer (glow effect) |
| `selected` | `boolean?` | `false` | Renders selected state (white border glow)|
| `onClick`  | `function?`| —       | Selection handler                         |

### `<ModuleItem />`
| Prop       | Type       | Default | Description                        |
|------------|------------|---------|-------------------------------------|
| `label`    | `string`   | —       | Module name text                    |
| `duration` | `string`   | —       | Time estimate badge (e.g. `"15m"`)  |
| `checked`  | `boolean`  | —       | Controlled checked state            |
| `onChange`  | `function?`| —       | Toggle callback                     |

---

## 5. Layout Spec

```
┌───────────────────────────────────────────────────────────┐
│  Navbar  │ h: 56px │ bg: brand-dark │ border-b: neutral-800 │
├──────────────────────────────────┬────────────────────────┤
│                                  │                        │
│       HeroPanel (flex-1)         │  Sidebar (448px fixed) │
│                                  │                        │
│  ● bg: brand-panel (#0f0f0f)     │  ● bg: brand-surface   │
│  ● hero-figure.png base layer    │    (#020607)           │
│  ● hero-overlay.png glow layer   │  ● p: 32px all sides   │
│  ● FloatingBar centered bottom   │  ● justify-between     │
│    (bottom: 32px)                │    + gap: 48px min     │
│  ● border-right: neutral-800     │                        │
│                                  │  TOP: Title → Modules  │
│                                  │  BTM: Agents → CTA     │
└──────────────────────────────────┴────────────────────────┘
```

- **Original Figma canvas:** 1907 × 901 px
- **Sidebar width:** 448px (23.46% of 1907px, fixed for responsiveness)
- **Hero panel:** fills remaining width via `flex-1`
- **Sidebar overflow:** `overflow-y-auto` with custom scrollbar

---

## 6. Figma → Code Mapping

| Figma Node ID | Component      | Layer Name                  |
|---------------|----------------|-----------------------------|
| `576:1796`    | `Navbar`       | Nav                         |
| `576:1733`    | `HeroPanel`    | Background+VerticalBorder   |
| `576:1734`    | (hero images)  | image 194 + image 195       |
| `576:1735`    | `FloatingBar`  | Background+Border+Shadow    |
| `585:2107`    | `Sidebar`      | Background (right panel)    |
| `585:2110`    | (heading)      | "Build Your Brand, Out Loud"|
| `585:2112`    | (modules)      | Modules section             |
| `585:2115–39` | `ModuleItem`   | Individual module rows      |
| `585:2141`    | (agent section)| Select Agent                |
| `585:2144`    | `AgentCard`    | Strategist card             |
| `585:2149`    | `AgentCard`    | Creative card               |
| `585:2154`    | `AgentCard`    | Guide card                  |
| `585:2159`    | (CTA button)   | Start Session               |

---

## 7. Data Contracts

### Agents
```js
{
  id: "strategist",       // unique identifier
  name: "STRATEGIST",     // display text
  role: "Big Picture",    // subtitle label
  image: "<url>",         // card background image
  overlay: "<url>|null"   // optional glow overlay (selected state)
}
```

### Modules
```js
{
  id: "brand-positioning",    // unique key
  label: "Brand Positioning", // display text
  duration: "15m",            // time estimate shown in badge
  defaultChecked: true        // initial checked state
}
```

---

## 8. Font Reference

All font files are included in `src/assets/fonts/` and registered via `@font-face` in `index.css`.

| File                              | Style   | Weight | Tailwind Usage                          |
|-----------------------------------|---------|--------|-----------------------------------------|
| `AwesomeSerif-Regular.otf`        | Upright | 400    | `font-awesome-serif` (default)          |
| `AwesomeSerif-LightRegular.otf`   | Upright | 300    | `font-awesome-serif font-light`         |
| `AwesomeSerif-MediumRegular.otf`  | Upright | 500    | `font-awesome-serif font-medium`        |
| `AwesomeSerif-SemiBoldRegular.otf`| Upright | 600    | `font-awesome-serif font-semibold`      |
| `AwesomeSerifItalic-Regular.otf`  | Italic  | 400    | `font-awesome-serif italic`             |
| `AwesomeSerifItalic-LightReg.otf` | Italic  | 300    | `font-awesome-serif italic font-light`  |
| `AwesomeSerifItalic-MedRegular.otf`| Italic | 500    | `font-awesome-serif italic font-medium` |
| `AwesomeSerifItalic-SmRegular.otf`| Italic  | 600    | `font-awesome-serif italic font-semibold`|

> **Inter** is loaded from the system font stack and does not require a file.
> **Fallback chain:** Awesome Serif → Georgia → Times New Roman → serif.

---

## 9. Image Assets Inventory

| File                | Dimensions    | Format | Source Figma Node | Usage                          |
|---------------------|---------------|--------|-------------------|--------------------------------|
| `hero-figure.png`   | 1376 × 768    | PNG    | image 194         | Main hero background           |
| `hero-overlay.png`  | 2752 × 1536   | PNG/A  | image 195         | Glow overlay on hero + card 1  |
| `agent-card-bg.png` | 1376 × 768    | PNG    | BackgroundBorder  | Agent cards 1 & 2 background   |
| `logo.svg`          | 18 × 18       | SVG    | 576:1797          | Navbar logo mark               |

---

## 10. Interaction States

| Element          | Default                      | Hover                        | Active/Selected               |
|------------------|------------------------------|------------------------------|-------------------------------|
| Agent Card       | border: neutral-800          | border: neutral-600          | border: white/30 + glow shadow|
| Module Checkbox  | border: neutral-300          | row bg: white/2%             | bg: white, checkmark: black   |
| Start Session CTA| bg: neutral-50, text: black  | opacity: 90%                 | —                             |
| Floating bar CTA | bg: neutral-50, text: black  | opacity: 90%                 | —                             |
| Nav links        | text: neutral-200            | text: neutral-50             | text: neutral-50              |

---

## 11. Notes for AI Agent Integration

- **All callbacks are prop-based:** `onStartSession`, `onAgentChange`, `onModulesChange` — wire these to your API layer.
- **State is local in Sidebar:** Lift to a global store (Zustand, Context, etc.) when connecting to backend.
- **Module/Agent data is hardcoded** in `Sidebar.jsx` — replace with API fetch when ready.
- **The floating bar audio visualizer** is static (4 equal bars). Animate by mapping real audio levels to individual bar heights via props.
- **No routing is implemented.** The "Sessions" and "Settings" nav links fire callback props — connect to your router.
- **Sidebar layout is adaptive:** `justify-between` pins the bottom section on tall viewports; `gap-12` (48px) provides minimum spacing on short viewports with scrolling.
