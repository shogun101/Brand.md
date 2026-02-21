export const brandPersonaModule = {
  id: 'persona',
  name: 'Persona Development',
  duration: '20m',
  sections: [
    'persona-profile',
    'pain-points',
    'language-patterns',
    'current-alternatives',
    'motivation-triggers',
  ],
  questionFlow: `MODULE: Persona Development
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
"Okay here's the persona: [summary]. Does this sound like a real person you've actually talked to?"`,
};
