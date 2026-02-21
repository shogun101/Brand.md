export const visionValuesModule = {
  id: 'vision-values',
  name: 'Vision & Values',
  duration: '15m',
  sections: [
    'vision-statement',
    'mission-statement',
    'core-principles',
    'guardrails',
    'brand-promise',
  ],
  questionFlow: `MODULE: Vision & Values
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
"Here's what I got: Your vision is [X], mission is [Y], and you'd never [Z]. That's a brand with some spine. Anything feel off?"`,
};
