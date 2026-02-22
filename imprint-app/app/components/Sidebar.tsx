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
  { id: 'positioning', label: 'Brand Positioning', duration: '15m', defaultChecked: true },
  { id: 'voice-tone', label: 'Voice & Tone', duration: '10m', defaultChecked: false },
  { id: 'persona', label: 'Persona Development', duration: '20m', defaultChecked: false },
  { id: 'vision-values', label: 'Vision & Values', duration: '15m', defaultChecked: false },
];

interface SidebarProps {
  onStartSession?: () => void;
  onAgentChange?: (id: string) => void;
  onModulesChange?: (modules: Map<string, boolean>) => void;
}

export default function Sidebar({ onStartSession, onAgentChange, onModulesChange }: SidebarProps) {
  const { selectedAgent, setAgent } = useSessionStore();
  const [modules, setModules] = useState<Map<string, boolean>>(
    () => new Map(DEFAULT_MODULES.map((m) => [m.id, m.defaultChecked]))
  );

  const handleAgentSelect = (id: string) => {
    setAgent(id);
    onAgentChange?.(id);
  };

  const handleModuleToggle = (id: string) => {
    setModules((prev) => {
      const next = new Map(prev);
      next.set(id, !next.get(id));
      onModulesChange?.(next);
      return next;
    });
  };

  const hasModules = Array.from(modules.values()).some(Boolean);

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

        {/* Modules */}
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
                checked={modules.get(mod.id) ?? false}
                onChange={() => handleModuleToggle(mod.id)}
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

        {/* CTA */}
        <button
          onClick={onStartSession}
          disabled={!hasModules}
          className="flex h-12 w-full items-center justify-center rounded-[46px] border border-white bg-neutral-50 font-awesome-serif text-base text-black transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        >
          Start Session
        </button>
      </div>
    </aside>
  );
}
