export interface Session {
  id: string;
  user_id: string;
  brand_name: string;
  module: 'positioning' | 'voice-tone' | 'persona' | 'vision-values';
  agent: 'strategist' | 'creative' | 'coach';
  status: 'active' | 'completed' | 'paused';
  duration_seconds: number;
  transcript: TranscriptEntry[];
  document: Record<string, SectionData>;
  created_at: string;
  updated_at: string;
}

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SectionData {
  title: string;
  content: string;
  captured_at?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  subtitle: string;
  systemPrompt: string;
}

export interface ModuleConfig {
  id: string;
  name: string;
  duration: string;
  sections: string[];
  questionFlow: string;
}
