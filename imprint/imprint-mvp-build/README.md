# Imprint — Build Instructions for AI Agent

## READ THESE FILES IN ORDER

1. **`IMPLEMENTATION.md`** — The full MVP spec. Everything you need: tech stack, file structure, question scripts, export templates, database schema, avatar animation, session flow, build order. **This is your primary reference.**

2. **`HANDOFF.md`** — Frontend component docs: props, layout spec, Figma node mapping, data contracts, interaction states.

3. **`DESIGN-SYSTEM.md`** — Pixel-level design tokens: colors, typography scale, spacing, borders, shadows, component patterns. **Follow this for any new UI you build.**

---

## What's in This Zip

This is a **working React + Vite + Tailwind 4 project** with the idle-state UI already built. You are extending this codebase, not starting from scratch.

### Already built (DO NOT rebuild):
- `src/components/Navbar.jsx` — Top nav
- `src/components/HeroPanel.jsx` — Left panel with hero images + floating bar
- `src/components/FloatingBar.jsx` — Glass pill overlay
- `src/components/Sidebar.jsx` — Right panel with modules + agents + CTA
- `src/components/AgentCard.jsx` — Selectable agent cards
- `src/components/ModuleItem.jsx` — Checkbox rows
- `src/assets/images/*` — Hero figure, overlay, agent card bg, logo
- `src/assets/fonts/*` — Awesome Serif (all weights + italic)
- `src/index.css` — Tailwind `@theme` tokens + `@font-face` + scrollbar

### Run it:
```bash
npm install
npm run dev    # → http://localhost:5173
```

---

## Your Task

Build the full Imprint MVP on top of this frontend. The `IMPLEMENTATION.md` has everything: voice conversation engine (ElevenLabs), live document streaming, question scripts for 4 modules, 3 agent personas, zip export with markdown templates, sessions history page, ambient audio, and avatar animation.

### Critical Rules

1. **Use the existing components** — Modify them, don't replace them
2. **Follow `DESIGN-SYSTEM.md`** for any new UI — Match the dark, cinematic aesthetic exactly (colors, fonts, spacing, borders, interaction states)
3. **Font is Awesome Serif** (bundled OTF), NOT Fraunces. Tailwind class: `font-awesome-serif`
4. **Tailwind 4** — Tokens are in `src/index.css` under `@theme {}`, not in `tailwind.config.js`
5. **Build order matters** — Follow the build sequence in `IMPLEMENTATION.md` (scaffold → layout → idle state → ambient audio → session flow → mic indicator → live document → complete state → export → sessions page)
6. **Avatar animation** — Start with Tier 1 CSS animations (breathing + glow states). Add Tier 2 canvas particles if time allows. Skip Tier 3 (Rive) for MVP.
