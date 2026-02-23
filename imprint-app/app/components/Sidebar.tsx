'use client';
import { useState } from 'react';
import AgentCard from './AgentCard';
import ModuleItem from './ModuleItem';
import { useSessionStore } from '@/lib/session-store';

const AGENTS = [
  {
    id: 'strategist',
    name: 'STRATEGIST',
    role: 'Big Picture',
    image: '/images/hero-figure.png',
  },
  {
    id: 'creative',
    name: 'CREATIVE',
    role: 'Visual Style',
    image: '/images/hero-creative.png',
  },
  {
    id: 'guide',
    name: 'GUIDE',
    role: 'Growth',
    image: '/images/hero-guide.png',
  },
];

const DEFAULT_MODULES = [
  { id: 'positioning', label: 'Brand Positioning', duration: '5 min', description: 'For your website, pitch decks & investor intros' },
  { id: 'voice-tone', label: 'Voice & Tone', duration: '5 min', description: 'Train any AI to write in your exact brand voice' },
  { id: 'persona', label: 'Brand Persona', duration: '5 min', description: 'For ads, landing pages & product decisions' },
  { id: 'vision-values', label: 'Vision & Values', duration: '5 min', description: 'For hiring pages, culture decks & fundraising' },
];

interface SidebarProps {
  onStartSession?: () => void;
  onAgentChange?: (id: string) => void;
  onModulesChange?: (activeModule: string) => void;
  isSignedIn?: boolean;
  onSignIn?: () => void;
}

export default function Sidebar({ onStartSession, onAgentChange, onModulesChange, isSignedIn = false, onSignIn }: SidebarProps) {
  const { selectedAgent, setAgent, setSelectedModule } = useSessionStore();
  // Single-select: only one module active at a time; default = first
  const [activeModule, setActiveModule] = useState<string>('positioning');

  const handleAgentSelect = (id: string) => {
    setAgent(id);
    onAgentChange?.(id);
  };

  const handleModuleSelect = (id: string) => {
    setActiveModule(id);
    setSelectedModule(id);
    onModulesChange?.(id);
  };

  return (
    <aside className="custom-scrollbar flex h-full flex-col justify-between gap-12 overflow-y-auto bg-brand-surface p-8">
      {/* TOP GROUP */}
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-[10px]">
          <h1 className="font-awesome-serif text-[32px] font-normal not-italic leading-none tracking-[0.64px] text-white">
            Build Your Brand, Out Loud
          </h1>
          <p className="font-inter text-[14.4px] font-normal leading-[21.6px] text-neutral-200">
            One conversation and you walk away with structured brand files your AI tools can
            actually use.
          </p>
        </div>

        {/* Modules — radio/single-select */}
        <div className="flex flex-col gap-3">
          <h2 className="font-inter text-[11.2px] font-semibold uppercase tracking-[0.56px] text-neutral-300">
            Modules
          </h2>
          <div className="flex flex-col gap-1">
            {DEFAULT_MODULES.map((mod) => (
              <ModuleItem
                key={mod.id}
                label={mod.label}
                duration={mod.duration}
                description={mod.description}
                checked={activeModule === mod.id}
                onChange={() => handleModuleSelect(mod.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM GROUP */}
      <div className="flex flex-col gap-12">
        {/* Agent selector */}
        <div className="flex flex-col gap-3">
          <h2 className="font-inter text-[11.2px] font-semibold uppercase tracking-[0.56px] text-neutral-300">
            Select Agent
          </h2>
          <div className="flex gap-3">
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                role={agent.role}
                image={agent.image}
                selected={selectedAgent === agent.id}
                onClick={() => handleAgentSelect(agent.id)}
              />
            ))}
          </div>
        </div>

        {/* CTA — auth gated */}
        {isSignedIn ? (
          <button
            onClick={onStartSession}
            className="flex h-12 w-full items-center justify-center rounded-[46px] border border-white bg-neutral-50 font-awesome-serif text-base text-black transition-opacity hover:opacity-90"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className="flex h-12 w-full items-center justify-center rounded-[46px] border border-white bg-neutral-50 font-awesome-serif text-base text-black transition-opacity hover:opacity-90"
          >
            Sign in to get started
          </button>
        )}
      </div>
    </aside>
  );
}
