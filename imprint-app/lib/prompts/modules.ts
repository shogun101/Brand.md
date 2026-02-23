export const MODULE_PROMPTS: Record<string, string> = {
  'positioning': `# Module: Brand Positioning

OPEN: "Brand Positioning — what are you building, who's it for, and why does it need to exist? More you share, the better. End whenever you want."

SECTIONS — emit via section_update as you hear them:
- company-overview: Plain language what they do day to day
- core-problem: The specific pain that made them build this
- target-audience: Who feels this most — role, situation, frustration
- competitive-landscape: What alternatives exist, what's broken about them
- positioning-statement: YOU generate this from everything else — never ask the user to write it

MAX 2 follow-ups. Target the biggest empty section only.
When done: generate positioning-statement yourself, then emit agent-directives with RULE 1/RULE 2 format, then close.`,

  'voice-tone': `# Module: Voice & Tone

OPEN: "Voice and Tone — if your brand was a person, how would they talk? What's their vibe — and what would they NEVER sound like? More you share, the better. End whenever you want."

SECTIONS — emit via section_update as you hear them:
- brand-personality: Personality words + anti-words (what they'd never be)
- tone-mapping: How voice shifts by context (marketing vs support vs social)
- formality-spectrum: Casual vs formal signals — emoji, contractions, register
- voice-guardrails: Always/never rules — cringe words, non-negotiable vibes
- do-dont-examples: YOU generate 2-3 before/after pairs from everything else

MAX 2 follow-ups. Target the biggest empty section only.
When done: generate do-dont-examples yourself, then emit agent-directives with RULE 1/RULE 2 format, then close.`,

  'persona': `# Module: Brand Persona

OPEN: "Brand Persona — describe your ideal customer to me. Who are they, what's their day like, what's frustrating them, and what are they doing about it right now? More you share, the better. End whenever you want."

SECTIONS — emit via section_update as you hear them:
- persona-profile: Role, age range, what their life looks like
- pain-points: Specific frustrations, "there has to be a better way" moments
- language-patterns: How they describe the problem, what they'd Google
- current-alternatives: What they use now — the janky workaround, the bad tool
- motivation-triggers: The breaking point that makes them finally act

MAX 2 follow-ups. Target the biggest empty section only.
When done: emit agent-directives with RULE 1/RULE 2 format, then close.`,

  'vision-values': `# Module: Vision & Values

OPEN: "Vision and Values — what are you really trying to change? If everything goes right, what's different about the world because your company exists? And what do you stand for along the way? More you share, the better. End whenever you want."

SECTIONS — emit via section_update as you hear them:
- vision-statement: The world when they've won — what's true that isn't true today
- mission-statement: What the team does every day to get there
- core-principles: Values that cost them something — not abstract words
- guardrails: What they'd never do, even for money
- brand-promise: YOU generate this from everything else — never ask the user to write it

MAX 2 follow-ups. Target the biggest empty section only.
When done: generate brand-promise yourself, then emit agent-directives with RULE 1/RULE 2 format, then close.`,
};
