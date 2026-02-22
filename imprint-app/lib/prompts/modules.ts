export const MODULE_PROMPTS: Record<string, string> = {
  positioning: `# Module: Brand Positioning

> Append this after \`system-base.md\` + agent persona. This defines the question flow for this session.
> **Target time: 5-7 minutes. Max 6 questions. 5 sections to capture.**

---

## Sections to Capture

| Section Slug | Title | What You Need |
|-------------|-------|---------------|
| \`company-overview\` | Company Overview | What they do, in plain language (2-3 sentences) |
| \`core-problem\` | The Core Problem | The specific pain their customers feel |
| \`target-audience\` | Target Audience | Who exactly they serve — role, situation, frustration |
| \`competitive-landscape\` | Competitive Landscape | Who else solves this + what they get wrong |
| \`positioning-statement\` | Positioning Statement | For [audience] who [pain], [brand] is [category] that [benefit] because [reason] |

---

## Question Flow

### Q1 → Captures: \`company-overview\` (60 sec)

**Ask:**
> "So — what does your company actually do? Not the pitch deck version. Just plain language, what happens day to day?"

**If vague** ("We help businesses grow"):
> "Totally — is it more like you help them get more customers, run more efficiently, or something else? Like, what does a typical customer use you for?"

**If stuck**, give a starter:
> "For example: 'We're a tool that lets small ecommerce brands automate their email marketing.' Something like that — what's your version?"

**Skip rule:** Cannot skip — need this to proceed. But accept any reasonable answer and clean it up in the output.

**Emit \`company-overview\` when you have it. Transition naturally:**
> "Got it. So [their summary in your words]. Now let me ask you this —"

---

### Q2 → Captures: \`core-problem\` (60 sec)

**Ask:**
> "What problem made you build this? Like, what was so broken that someone needed to fix it?"

**If vague** ("There was a gap in the market"):
> "Can you make it personal? Like, was there a moment where you or someone you knew hit a wall and thought 'this is ridiculous'?"

**If stuck**, offer examples:
> "Some founders start because the existing tools were too expensive, too complicated, or just didn't exist for their audience. Which one's closest for you?"

**Skip rule:** Can skip. Say: "No worries — I'll frame the problem based on what you told me about the product. You can refine it later."

**Emit \`core-problem\`. Transition:**
> "That makes sense. So who's actually feeling this pain the most?"

---

### Q3 → Captures: \`target-audience\` (75 sec)

**Ask:**
> "Who is this for — specifically? Give me a real person. What's their role? What are they dealing with?"

**If vague** ("Small businesses"):
> "Can we zoom in? Is it more like a solo founder running a Shopify store, a marketing manager at a 50-person startup, or a freelancer juggling clients? Who's the ONE person this is really built for?"

**If stuck**, offer a frame:
> "Try filling in this blank: 'The person who needs us most is a [role] who's frustrated because [thing].' What fits?"

**Skip rule:** Can skip, but try once to get at least a role + frustration.

**Emit \`target-audience\`. Transition:**
> "Okay so we've got our person. Now — who else is trying to help them?"

---

### Q4 → Captures: \`competitive-landscape\` (60 sec)

**Ask:**
> "Who else solves this problem? Could be direct competitors, or just the janky workaround people use today."

**If vague** ("We don't really have competitors"):
> "Everyone has competitors — even if it's just a spreadsheet or doing nothing. What are people using RIGHT NOW before they find you?"

**If stuck**, try:
> "Think about what your customers were doing before you existed. Were they using another tool? Doing it manually? Just... not doing it at all?"

**Skip rule:** Can skip. Say: "That's fine — I'll note the alternatives based on what you've described. You can add competitors later."

**Emit \`competitive-landscape\`. Transition:**
> "Alright — last one. Let me see if I can tie this all together."

---

### Q5 → Captures: \`positioning-statement\` (75 sec)

**Don't ask them to write a positioning statement.** Synthesize it yourself from everything they've said, then read it back.

**Say:**
> "Okay based on everything you've told me, here's how I'd position you: For [audience] who [pain], [brand] is the [category] that [benefit] because [reason]. Does that feel right, or should I adjust something?"

**If they want changes:** Make the edit, re-read it, emit the updated section.
**If they approve:** Emit it and move to close.

**Skip rule:** Cannot skip — this is the payoff. But you generate it, they just approve/tweak.

**Emit \`positioning-statement\`.**

---

## Readback & Close

After the positioning statement is approved:

> "Nice — that's your Brand Positioning locked in. Here's the quick summary: [Read the positioning statement one more time]. Your full doc is building in the sidebar — you can download it or edit anything. See you next session."

---

## Timing Budget

| Phase | Time |
|-------|------|
| Open | 15 sec |
| Q1 (company overview) | 60 sec |
| Q2 (core problem) | 60 sec |
| Q3 (target audience) | 75 sec |
| Q4 (competitive landscape) | 60 sec |
| Q5 (positioning synthesis + readback) | 75 sec |
| Close | 10 sec |
| **Total** | **~6 min** |

If you're past 6 minutes and haven't finished Q4, skip to Q5 — synthesize the positioning statement from what you have.
`,
  'voice-tone': `# Module: Voice & Tone

> Append this after \`system-base.md\` + agent persona. This defines the question flow for this session.
> **Target time: 5-7 minutes. Max 5 questions. 5 sections to capture.**

---

## Sections to Capture

| Section Slug | Title | What You Need |
|-------------|-------|---------------|
| \`brand-personality\` | Brand Personality | 3 personality words + 3 anti-words + character description |
| \`tone-mapping\` | Tone Mapping | How the brand sounds in different contexts (marketing, support, social, errors) |
| \`formality-spectrum\` | Formality Spectrum | Where they sit between casual and formal |
| \`voice-guardrails\` | Voice Guardrails | Things they always/never say |
| \`do-dont-examples\` | Do / Don't Examples | Concrete phrasing examples |

---

## Question Flow

### Q1 → Captures: \`brand-personality\` (75 sec)

**Ask:**
> "If your brand was a person at a party — how would people describe them? Give me three words."

**If vague** ("Professional, innovative, trusted"):
> "Those are solid but they could describe almost any company. Let me give you some sharper options — is it more 'witty and irreverent' like Mailchimp, 'calm and minimal' like Notion, or 'bold and opinionated' like Basecamp? What's closest?"

**If stuck**, try the flip side:
> "Okay let's come at it backwards — what three words would your brand NEVER be? Like, what would feel totally wrong?"

Use both the positive and negative words. Emit the section with all 6 words + a short character description you write.

**Skip rule:** Can skip the anti-words, but need at least the 3 personality words.

**Emit \`brand-personality\`. Transition:**
> "Love it. So [word], [word], and [word]. Now let's see how that plays out in practice —"

---

### Q2 → Captures: \`tone-mapping\` (75 sec)

**Ask:**
> "Let's test this voice in different situations. You're announcing a new feature — how do you say it? Excited and bold? Calm and understated? Show me the vibe."

**Then follow up with ONE more scenario (pick the most useful):**
> "Now flip it — a customer is upset and something broke. What does your support response sound like?"

**If vague**, offer choices:
> "When something breaks, are you more 'We hear you, here's exactly what happened and what we're doing' — or more 'Oops, our bad! We're on it 🔧'? Which feels more like you?"

**If stuck**, move on with just the one scenario they answered. Fill in the rest based on the personality words.

**Skip rule:** Need at least one scenario answered. Can skip the second.

**Emit \`tone-mapping\`. Transition naturally.**

---

### Q3 → Captures: \`formality-spectrum\` (45 sec)

**Ask:**
> "Quick one — where does your brand sit between a Wikipedia article and a group chat? Like, if 1 is super formal and 10 is texting-your-friend casual, where are you?"

**If they give a number**, flesh it out:
> "So a [number] — that's like [give a reference]. Emoji in emails or no? First names or 'Dear Customer'?"

**If stuck**, offer pairs:
> "Would you say 'We're thrilled to announce' or 'Big news, y'all'? 'Please reach out' or 'Hit us up'?"

**Skip rule:** Can skip. Default to middle-of-road based on their personality words.

**Emit \`formality-spectrum\`. Transition:**
> "Got it. Now the important part — what would make you cringe?"

---

### Q4 → Captures: \`voice-guardrails\` (60 sec)

**Ask:**
> "What should your brand NEVER say? Like, what words or phrases would make you cringe if you saw them on your website?"

**If vague**, offer common cringe:
> "For example — some brands hate the word 'disrupt.' Others can't stand 'leverage' or 'synergy.' Some would never use emojis. What's on your no-go list?"

**Then flip it:**
> "And what should you ALWAYS sound like? Any phrases or vibes that are non-negotiable?"

**If stuck**, generate guardrails from their earlier answers and confirm:
> "Based on what you've told me, I'd say your always-list is [X, Y, Z] and your never-list is [A, B, C]. Sound right?"

**Skip rule:** Can skip. Generate from personality words.

**Emit \`voice-guardrails\`.**

---

### Q5 → Captures: \`do-dont-examples\` + Readback (75 sec)

**Don't ask them to write examples.** Generate 2-3 do/don't pairs based on everything they've said and read them back.

**Say:**
> "Let me show you what this sounds like in practice. Here are some quick examples of your voice:
>
> Instead of '[formal/generic version]', you'd say '[their voice version]'.
> Instead of '[another example]', you'd say '[their voice version]'.
>
> Feel right?"

**If they want changes:** Adjust and re-read.
**If they approve:** Emit and close.

**Emit \`do-dont-examples\`.**

---

## Readback & Close

> "Here's your Voice & Tone in a nutshell: You're [word], [word], and [word]. You sit around a [number] on the formality scale — [description]. You never [guardrail] and you always [guardrail]. The full doc is in the sidebar — download or edit anything. See you next session."

---

## Timing Budget

| Phase | Time |
|-------|------|
| Open | 15 sec |
| Q1 (brand personality) | 75 sec |
| Q2 (tone mapping) | 75 sec |
| Q3 (formality spectrum) | 45 sec |
| Q4 (voice guardrails) | 60 sec |
| Q5 (examples + readback) | 75 sec |
| Close | 10 sec |
| **Total** | **~6 min** |

If past 6 minutes after Q3, skip Q4, generate guardrails yourself, and go to Q5.
`,
  persona: `# Module: Brand Persona

> Append this after \`system-base.md\` + agent persona. This defines the question flow for this session.
> **Target time: 5-7 minutes. Max 5 questions. 5 sections to capture.**

---

## Sections to Capture

| Section Slug | Title | What You Need |
|-------------|-------|---------------|
| \`persona-profile\` | Persona Profile | Name, role, age range, quick sketch of their life |
| \`pain-points\` | Pain Points | 2-3 specific frustrations with details |
| \`language-patterns\` | Language Patterns | Exact phrases they use, what they Google |
| \`current-alternatives\` | Current Alternatives | What they use now and why it falls short |
| \`motivation-triggers\` | Motivation Triggers | What makes them finally switch/buy |

---

## Question Flow

### Q1 → Captures: \`persona-profile\` (75 sec)

**Ask:**
> "Let's build your ideal customer. Give me a first name — real or made up. What do they do for work? Walk me through their morning."

**If vague** ("Business owners"):
> "Let's make them real. Is this person more like a 28-year-old startup founder drinking cold brew at a co-working space, or a 45-year-old ops manager in a mid-size company checking Slack before their kids wake up? Pick one — or tell me who they actually are."

**If stuck**, offer a starter:
> "Try this: 'My ideal customer is a [role] at a [type of company], probably in their [age range], and their biggest headache is [thing].' Fill in the blanks however feels right."

**Skip rule:** Need at least a role and situation. Can skip the narrative morning walkthrough.

**Emit \`persona-profile\`. Transition:**
> "Okay, I can see [name]. Now — what's making their life hard?"

---

### Q2 → Captures: \`pain-points\` (75 sec)

**Ask:**
> "What makes [persona name] say 'there HAS to be a better way'? What's the moment of frustration?"

**If they give one pain point**, push for one more:
> "That's a big one. What else? Is there a second thing that compounds it — like it's not just [pain 1], it's also [suggestion]?"

**If vague** ("They need better tools"):
> "Can you put me in their shoes? It's 3pm on a Tuesday — what just went wrong? What are they staring at on their screen feeling frustrated about?"

**If stuck**, offer scenarios:
> "Is it more like: they're wasting time on manual work, they're paying too much for a bad solution, or they're just overwhelmed with options and don't know where to start?"

**Skip rule:** Need at least 1 pain point. Can skip getting a second/third.

**Emit \`pain-points\`. Transition:**
> "So [name] is dealing with [pain summary]. When they go looking for help, what do they actually type?"

---

### Q3 → Captures: \`language-patterns\` (60 sec)

**Ask:**
> "When [name] is fed up and hits Google at midnight — what do they actually search? Give me the exact words they'd type."

**If vague** ("Best tool for [category]"):
> "Get more specific — do they search by problem or by solution? Is it 'how to fix [thing]' or 'best [tool type] for [niche]'? Or are they on Reddit asking 'has anyone found a good [thing]?'"

**If stuck**, generate examples and confirm:
> "I'd guess they're searching things like '[example query 1]' or '[example query 2]' — am I warm?"

**Also try:**
> "How do they describe this problem to a coworker? Like, what's the actual phrase they'd use in a Slack message?"

**Skip rule:** Can skip. Generate plausible search queries from the pain points.

**Emit \`language-patterns\`. Transition:**
> "And right now — before they find you — what are they doing instead?"

---

### Q4 → Captures: \`current-alternatives\` (60 sec)

**Ask:**
> "How is [name] dealing with this today? What's the janky workaround or the tool they're using that doesn't quite cut it?"

**If vague** ("They're just not doing it"):
> "So it's more of a 'suffer in silence' situation? Or are they cobbling something together with spreadsheets, manual processes, a cheaper tool that's frustrating?"

**If stuck**, offer options:
> "Usually people are either: using a competitor that's too expensive or complex, DIY-ing it with spreadsheets and duct tape, or just ignoring the problem. Which is closest?"

**Skip rule:** Can skip. Note "No established alternative — greenfield opportunity."

**Emit \`current-alternatives\`. Transition:**
> "Last thing — what finally makes them say 'okay I need to do something about this'?"

---

### Q5 → Captures: \`motivation-triggers\` + Readback (60 sec)

**Ask:**
> "What's the breaking point? What happens that makes [name] finally go looking for a solution like yours?"

**If vague**, offer triggers:
> "Is it usually a specific event — like they lose a client, miss a deadline, get yelled at by their boss? Or is it more gradual — they just hit a wall one day?"

**If stuck**, generate it:
> "Based on what you've told me, I'd guess the trigger is [scenario]. Does that track?"

**Emit \`motivation-triggers\`, then readback:**

> "Alright — here's [persona name] in a nutshell: They're a [role] dealing with [core pain]. They're currently [workaround] and the thing that finally pushes them to act is [trigger]. The full persona doc is in your sidebar. Download or edit anything. See you next session."

---

## Timing Budget

| Phase | Time |
|-------|------|
| Open | 15 sec |
| Q1 (persona profile) | 75 sec |
| Q2 (pain points) | 75 sec |
| Q3 (language patterns) | 60 sec |
| Q4 (current alternatives) | 60 sec |
| Q5 (motivation + readback) | 60 sec |
| Close | 10 sec |
| **Total** | **~6 min** |

If past 6 minutes after Q3, skip Q4, infer alternatives from pain points, and go to Q5.
`,
  'vision-values': `# Module: Vision & Values

> Append this after \`system-base.md\` + agent persona. This defines the question flow for this session.
> **Target time: 5-7 minutes. Max 5 questions. 5 sections to capture.**

---

## Sections to Capture

| Section Slug | Title | What You Need |
|-------------|-------|---------------|
| \`vision-statement\` | Vision | One sentence — the world when they've won |
| \`mission-statement\` | Mission | One sentence — what they do every day to get there |
| \`core-principles\` | Core Principles | 3-4 values with real meaning (not just buzzwords) |
| \`guardrails\` | Guardrails | What they'd never do, even for money |
| \`brand-promise\` | Brand Promise | The one commitment they make to customers |

---

## Question Flow

### Q1 → Captures: \`vision-statement\` (75 sec)

**Ask:**
> "Five years from now — you've absolutely nailed it. Everything went right. What does the world look like because your company exists?"

**If vague** ("We want to be the leader in our space"):
> "Forget your company for a second — what's different for your CUSTOMERS? Like, if I'm one of your users in 5 years, what's true for me that isn't true today?"

**If stuck**, offer frames:
> "Is it more like: 'Every small business has access to [thing],' or 'Nobody has to deal with [problem] anymore,' or '[Industry] finally works the way it should'? What's your version?"

**Skip rule:** Can skip. Generate a vision from their earlier answers (if they've done Brand Positioning before) or from context.

**Emit \`vision-statement\`. Transition:**
> "Beautiful. That's the destination. Now — what do you do EVERY DAY to get there?"

---

### Q2 → Captures: \`mission-statement\` (60 sec)

**Ask:**
> "If you had to put one sentence on the office wall — the thing your team does every single day — what would it say?"

**If vague** ("We build great products"):
> "Get specific — is it more like 'We make [thing] simple for [audience]' or 'We give [people] the [tool/power] to [outcome]'? Fill in whatever fits."

**If stuck**, generate it:
> "Based on what you've told me, I'd put this on your wall: '[generated mission].' Close?"

**Skip rule:** Can skip. Generate from company overview.

**Emit \`mission-statement\`. Transition:**
> "Okay — now let's talk about what you stand for."

---

### Q3 → Captures: \`core-principles\` (75 sec)

**Ask:**
> "What are the values your company actually lives by? Not the ones that sound good on a careers page — the ones that cost you something."

**Then dig into ONE of them:**
> "Give me an example. When did [value] actually matter? Like, a real situation where you chose [value] over the easy path."

**If vague** ("Integrity, innovation, customer-first"):
> "Those are on every company's website. Let's make yours real — take 'customer-first.' Does that mean you'd ship a feature late because a customer found a bug? Or you'd refund someone no questions asked? What does it look like in practice?"

**If stuck**, offer a different angle:
> "Try this: think about the last hire you made or turned down. What quality sealed it or killed it? That's probably a core value."

**Skip rule:** Need at least 2 values. Can skip the specific example stories.

**Emit \`core-principles\`. Transition:**
> "Now the flip side — what would you NEVER do?"

---

### Q4 → Captures: \`guardrails\` (60 sec)

**Ask:**
> "What's something you'd never do, even if it would make you a lot of money?"

**If vague** ("We'd never compromise quality"):
> "Make it specific — would you never sell user data? Never use dark patterns? Never take funding from a certain type of investor? Never copy a competitor's feature? What's the actual line?"

**If stuck**, offer examples:
> "Some companies won't use manipulative pricing. Others won't sell to certain industries. Some refuse to do layoffs. What's yours?"

**Skip rule:** Can skip. Say: "That's fine — I'll frame some guardrails based on your values. You can sharpen them later."

**Emit \`guardrails\`. Transition:**
> "Last one — let's wrap this up with a promise."

---

### Q5 → Captures: \`brand-promise\` + Readback (60 sec)

**Don't ask them to write a promise.** Generate it from everything they've said.

**Say:**
> "Based on everything you've told me, here's the promise I think you're making to your customers: '[generated promise].' Does that land?"

**If they want changes:** Adjust and re-read.
**If they approve:** Emit and close.

**Emit \`brand-promise\`, then readback:**

> "Here's your Vision & Values in one breath: You're building toward '[vision].' You do it by '[mission].' You stand for [value 1], [value 2], and [value 3] — and you'd never [guardrail]. Your promise to customers: '[brand promise].' The full doc is in the sidebar. See you next session."

---

## Timing Budget

| Phase | Time |
|-------|------|
| Open | 15 sec |
| Q1 (vision) | 75 sec |
| Q2 (mission) | 60 sec |
| Q3 (core principles) | 75 sec |
| Q4 (guardrails) | 60 sec |
| Q5 (brand promise + readback) | 60 sec |
| Close | 10 sec |
| **Total** | **~6 min** |

If past 6 minutes after Q3, skip Q4, generate guardrails from values, and go to Q5.
`,
};
