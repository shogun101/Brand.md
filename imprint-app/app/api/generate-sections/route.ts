import OpenAI from 'openai';

interface TranscriptEntry {
  source: 'user' | 'ai';
  message: string;
}

interface SectionDef {
  slug: string;
  title: string;
}

const MODULE_SECTIONS: Record<string, SectionDef[]> = {
  positioning: [
    { slug: 'company-overview',      title: 'Company Overview' },
    { slug: 'core-problem',          title: 'The Core Problem' },
    { slug: 'target-audience',       title: 'Target Audience' },
    { slug: 'competitive-landscape', title: 'Competitive Landscape' },
    { slug: 'positioning-statement', title: 'Positioning Statement' },
  ],
  'voice-tone': [
    { slug: 'personality-words',  title: 'Personality Words' },
    { slug: 'formality-spectrum', title: 'Formality Spectrum' },
    { slug: 'voice-examples',     title: 'Voice Examples' },
    { slug: 'words-to-avoid',     title: 'Words to Avoid' },
  ],
  persona: [
    { slug: 'persona-name',      title: 'Persona Name & Profile' },
    { slug: 'core-pain',         title: 'Core Pain Point' },
    { slug: 'daily-reality',     title: 'Daily Reality' },
    { slug: 'what-they-want',    title: 'What They Want' },
    { slug: 'why-they-choose-you', title: 'Why They Choose You' },
  ],
  'vision-values': [
    { slug: 'vision-statement', title: 'Vision Statement' },
    { slug: 'brand-promise',    title: 'Brand Promise' },
    { slug: 'core-values',      title: 'Core Values' },
    { slug: 'north-star',       title: 'North Star Metric' },
  ],
};

export async function POST(req: Request) {
  try {
    const { transcript, moduleKey, agentKey, brandName } = (await req.json()) as {
      transcript: TranscriptEntry[];
      moduleKey: string;
      agentKey: string;
      brandName?: string;
    };

    const sections = MODULE_SECTIONS[moduleKey] ?? MODULE_SECTIONS['positioning'];
    const sectionList = sections
      .map((s) => `- "${s.slug}": ${s.title}`)
      .join('\n');

    const exampleJson = Object.fromEntries(
      sections.map((s) => [s.slug, { title: s.title, content: '...' }])
    );

    const systemPrompt = `You are a brand strategist extracting structured brand information from a voice conversation transcript.

The conversation was a ${moduleKey} session with agent role: ${agentKey}.
The brand name is: ${brandName || 'unknown'}.

The session was meant to capture these sections:
${sectionList}

Your job: read the transcript carefully and extract what was discussed for each section.

Rules:
- Write each section in third person about the brand (use the brand name or "they", not "you").
- Keep each section 2–4 sentences. Be specific, not generic. Use the user's actual words where possible.
- If a section was not discussed at all, write: "[Not covered in this session]"
- Do NOT invent details that weren't in the conversation.

Return ONLY valid JSON in this exact format (no markdown, no code fences, raw JSON only):
${JSON.stringify({ sections: exampleJson }, null, 2)}`;

    const transcriptText = transcript
      .map((t) => `${t.source === 'ai' ? 'Agent' : 'User'}: ${t.message}`)
      .join('\n');

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Here is the conversation transcript:\n\n${transcriptText}\n\nExtract the brand information into the JSON format specified.`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? '';

    // Strip any accidental markdown code fences
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as {
      sections: Record<string, { title: string; content: string }>;
    };

    return Response.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-sections] error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
