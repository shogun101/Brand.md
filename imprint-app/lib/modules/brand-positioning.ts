export const brandPositioningModule = {
  id: 'positioning',
  name: 'Brand Positioning',
  duration: '15m',
  sections: [
    'company-overview',
    'target-audience',
    'competitive-landscape',
    'value-proposition',
    'positioning-statement',
  ],
  questionFlow: `MODULE: Brand Positioning
SECTIONS TO FILL: company-overview, value-proposition, target-audience, competitive-landscape, positioning-statement
ESTIMATED TIME: 7 minutes

QUESTION FLOW:

[WARM-UP — get them comfortable and talking]
"Alright, let's start simple. Forget the elevator pitch — just tell me: what does your company actually do, day to day?"

[DIG INTO WHY — make it personal]
"Okay, so you do [X]. But here's what I really want to know — what pissed you off enough to build this? What's the origin story?"

(If they gave a polished/corporate answer):
"That sounds like your LinkedIn headline. Give me the version you'd tell a friend at a bar at 11pm."

→ Emit section: company-overview

[FIND THE CUSTOMER — make it specific]
"Who desperately needs this? Not a demographic — give me one specific person. What's their name? What do they do at 9am on a Tuesday?"
"What's their biggest headache that you fix? Like, the thing they complain about in Slack channels and group chats?"

→ Emit section: target-audience

[COMPETITIVE LANDSCAPE — get honest]
"Who else is trying to solve this? Be honest — who shows up when someone Googles your thing?"
"Okay so there's [competitors]. What do they get fundamentally wrong? Not tactically — philosophically. What do they misunderstand about the problem?"

→ Emit section: competitive-landscape

[THE KILL QUESTION — reveal true differentiation]
"Here's the real test. If your company vanished tomorrow — poof, gone — what would your customers actually do? Would they even notice?"
"So what's the one thing only you can do? The thing that would be really, really hard for someone else to copy?"

→ Emit section: value-proposition

[SYNTHESIS — confirm and push]
"Okay here's what I'm hearing. For [audience] who [pain point], you're the [category] that [unique value] because [reason]. Does that feel right, or did I miss something?"

→ Emit section: positioning-statement

[WRAP]
"Alright, that's really strong. Here's your positioning in a nutshell: [summary]. I've captured everything. Take a look at the document — anything you want to adjust?"`,
};
