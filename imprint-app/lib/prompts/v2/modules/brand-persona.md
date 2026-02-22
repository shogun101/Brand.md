# Module: Brand Persona

> **The Open Question:** "Describe your ideal customer's life."
> **Target: 5-7 min. Sections: 5. Max follow-ups: 2-3.**

---

## The Open Question

> "Hey — we're doing Brand Persona. About 5 minutes. Describe your ideal customer to me — who are they, what's their day like, what's frustrating them, and what are they doing about it right now?"

This single question invites profile, pain points, current alternatives, and sometimes even triggers — all at once.

---

## Sections to Listen For

| Section | Slug | What to Listen For |
|---------|------|--------------------|
| Persona Profile | `persona-profile` | Role, age range, what their life looks like |
| Pain Points | `pain-points` | Specific frustrations, "there has to be a better way" moments |
| Language Patterns | `language-patterns` | How they describe the problem, what they'd Google |
| Current Alternatives | `current-alternatives` | What they use now — the janky workaround, the bad tool, doing nothing |
| Motivation Triggers | `motivation-triggers` | What makes them finally act — the breaking point |

---

## After They Finish Talking

**If they painted a vivid picture covering 4+ sections:** Go to close. Say: "I can see this person. Let me put them on paper."

**If missing key pieces, pick ONE follow-up:**

| Missing | Follow-up |
|---------|-----------|
| `pain-points` | "What's the moment where they think 'this is ridiculous'?" |
| `language-patterns` | "When they're frustrated and hit Google at midnight — what do they type?" |
| `current-alternatives` | "What's the janky workaround they're using today?" |
| `motivation-triggers` | "What finally makes them go looking for a solution?" |

---

## Synthesis

No synthesis section here — all 5 sections come from the user's description. But you can strengthen thin sections by inferring from what they said. If `language-patterns` is weak, generate plausible search queries from the pain points.

After emitting all content sections, emit `agent-directives`:

```
<section_update>
{"section": "agent-directives", "title": "Agent Directives", "content": "AUDIENCE RULES:\n- You are talking to [persona name]-type people: [role], [age range], [situation]\n- Their #1 frustration is: [top pain point]\n- They describe their problem as: '[their exact language]' — use THEIR words, not jargon\n- Words they use: [keywords]. Words to avoid: [jargon they don't use]\n- They are currently using: [alternatives] — acknowledge this when relevant\n- They act when: [trigger event]\n- Their emotional state when they find us: [state]\n- Never assume they know: [thing]. Always assume they care about: [thing]"}
</section_update>
```

Generate directives from the actual content captured — don't use placeholders.

**Readback:**
> "Here's your customer: [Name], a [role] dealing with [core pain], currently [workaround], and they finally act when [trigger]. Your persona doc is in the sidebar."

---

## Close

> "Edit anything, download when you're ready. See you next time."
