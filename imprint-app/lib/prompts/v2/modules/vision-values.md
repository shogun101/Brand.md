# Module: Vision & Values

> **The Open Question:** "What are you really trying to change?"
> **Target: 5-7 min. Sections: 5. Max follow-ups: 2-3.**

---

## The Open Question

> "Hey — we're doing Vision & Values. About 5 minutes. Tell me: what are you really trying to change? Like, if everything goes right — what's different about the world because your company exists? And what do you stand for along the way?"

This naturally invites vision, mission, values, and often guardrails too.

---

## Sections to Listen For

| Section | Slug | What to Listen For |
|---------|------|--------------------|
| Vision | `vision-statement` | The world when they've won — what's true that isn't true today |
| Mission | `mission-statement` | What they do every day to get there |
| Core Principles | `core-principles` | Values that cost them something — not just "integrity" and "innovation" |
| Guardrails | `guardrails` | What they'd never do, even for money |
| Brand Promise | `brand-promise` | YOU generate this from everything else |

---

## After They Finish Talking

**If they gave you a clear vision + values + some guardrails:** Go straight to generating the brand promise.

**If missing key pieces, pick ONE follow-up:**

| Missing | Follow-up |
|---------|-----------|
| `vision-statement` | "Five years from now, everything went right — what's different for your customers?" |
| `core-principles` | "What's a value that's actually cost you something — a decision where you chose principle over the easy path?" |
| `guardrails` | "What would you never do, even if it made you a lot of money?" |
| `mission-statement` | "If you put one sentence on the office wall — what your team does every day — what would it say?" |

---

## Synthesis: Brand Promise

You generate this. Don't ask them to write it.

> "Based on everything you've told me, here's the promise I think you're making: '[generated promise].' Does that land?"

If they tweak → update and emit.
If they approve → emit `brand-promise`, then emit `agent-directives`:

```
<section_update>
{"section": "agent-directives", "title": "Agent Directives", "content": "VALUES RULES:\n- Our vision is: [vision] — reference when explaining long-term direction\n- Our mission is: [mission] — use when explaining what we do daily\n- We stand for: [value 1] (means: [implication]), [value 2] (means: [implication]), [value 3] (means: [implication])\n- We would NEVER: [guardrail 1], [guardrail 2], [guardrail 3]\n- Brand promise: '[promise]' — the one-line commitment to every user\n- When facing tradeoffs, default to: [priority value]\n- When asked about values, lead with stories and examples, not abstract words"}
</section_update>
```

Generate directives from the actual content captured — don't use placeholders.

---

## Close

> "Your Vision & Values doc is in the sidebar. Edit anything, download when you're ready. See you next time."
