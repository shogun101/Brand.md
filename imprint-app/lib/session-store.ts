import { create } from 'zustand';

type AppState = 'idle' | 'active' | 'complete';
type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';

interface SectionData {
  title: string;
  content: string;
}

export interface KitData {
  tagline: string;
  sections: Array<{ id: string; title: string; content: string }>;
  agent_directives: string;
  retrieval_rules: Record<string, string[]>;
  usage_prompts: string[];
}

export interface TranscriptEntry {
  id: string;
  role: 'user' | 'ai';
  text: string;
  ts: number;
}

interface SessionStore {
  state: AppState;
  setState: (s: AppState) => void;

  selectedAgent: string;
  selectedModules: string[];
  setAgent: (a: string) => void;
  /** Single-select: set the one active module */
  setSelectedModule: (m: string) => void;
  toggleModule: (m: string) => void;

  sessionId: string | null;
  brandName: string;
  setBrandName: (n: string) => void;
  micState: MicState;
  setMicState: (m: MicState) => void;
  micError: string | null;
  setMicError: (e: string | null) => void;
  elapsedSeconds: number;
  tick: () => void;

  sections: Record<string, SectionData>;
  addSection: (slug: string, data: SectionData) => void;
  updateSection: (slug: string, content: string) => void;

  transcript: TranscriptEntry[];
  addTranscript: (role: 'user' | 'ai', text: string) => void;

  audioEnabled: boolean;
  toggleAudio: () => void;

  audioLevel: number;
  setAudioLevel: (level: number) => void;

  /** Plan A: true while GPT-4o is generating sections from transcript */
  isGenerating: boolean;
  setGenerating: (v: boolean) => void;

  /** Brand kit expansion */
  kitData: KitData | null;
  setKitData: (data: KitData) => void;
  isGeneratingKit: boolean;
  setGeneratingKit: (v: boolean) => void;

  reset: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  state: 'idle',
  setState: (s) => set({ state: s }),

  selectedAgent: 'strategist',
  selectedModules: ['positioning'],
  setAgent: (a) => set({ selectedAgent: a }),

  setSelectedModule: (m) => set({ selectedModules: [m] }),

  toggleModule: (m) =>
    set((s) => ({
      selectedModules: s.selectedModules.includes(m)
        ? s.selectedModules.filter((x) => x !== m)
        : [...s.selectedModules, m],
    })),

  sessionId: null,
  brandName: '',
  setBrandName: (n) => set({ brandName: n }),
  micState: 'READY',
  setMicState: (m) => set({ micState: m }),
  micError: null,
  setMicError: (e) => set({ micError: e }),
  elapsedSeconds: 0,
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  sections: {},
  addSection: (slug, data) =>
    set((s) => ({
      sections: { ...s.sections, [slug]: data },
    })),
  updateSection: (slug, content) =>
    set((s) => ({
      sections: {
        ...s.sections,
        [slug]: { ...s.sections[slug], content },
      },
    })),

  transcript: [],
  addTranscript: (role, text) =>
    set((s) => ({
      transcript: [
        ...s.transcript,
        { id: crypto.randomUUID(), role, text, ts: Date.now() },
      ],
    })),

  audioEnabled: true,
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

  audioLevel: 0,
  setAudioLevel: (level) => set({ audioLevel: level }),

  isGenerating: false,
  setGenerating: (v) => set({ isGenerating: v }),

  kitData: null,
  setKitData: (data) => set({ kitData: data }),
  isGeneratingKit: false,
  setGeneratingKit: (v) => set({ isGeneratingKit: v }),

  reset: () =>
    set({
      state: 'idle',
      selectedAgent: 'strategist',
      selectedModules: ['positioning'],
      sessionId: null,
      brandName: '',
      micState: 'READY',
      micError: null,
      elapsedSeconds: 0,
      sections: {},
      transcript: [],
      audioLevel: 0,
      isGenerating: false,
      kitData: null,
      isGeneratingKit: false,
    }),
}));
