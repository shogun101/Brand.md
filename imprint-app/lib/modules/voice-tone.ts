export const voiceToneModule = {
  id: 'voice-tone',
  name: 'Voice & Tone',
  duration: '10m',
  sections: [
    'brand-personality',
    'tone-mapping',
    'voice-guardrails',
    'do-dont-examples',
    'formality-spectrum',
  ],
  questionFlow: `MODULE: Voice & Tone
SECTIONS TO FILL: brand-personality, tone-mapping, voice-guardrails, do-dont-examples, formality-spectrum
ESTIMATED TIME: 6 minutes

QUESTION FLOW:

[WARM-UP — fun and sensory]
"Okay, weird question. If your brand walked into a party — what's it wearing? How does it greet people? Does it head to the DJ booth or the quiet balcony?"

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
"Your brand voice is essentially: [summary]. That feel right? Anything that made you go 'eh, not quite'?"`,
};
