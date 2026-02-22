import Navbar from "./components/Navbar";
import HeroPanel from "./components/HeroPanel";
import Sidebar from "./components/Sidebar";

/**
 * App — Root layout for the Imprint brand-builder landing screen
 *
 * Structure:
 *   ┌────────────────────────────────────────────────────────┐
 *   │  Navbar (56 px, full width)                            │
 *   ├──────────────────────────────┬─────────────────────────┤
 *   │                              │                         │
 *   │  HeroPanel (flex-1)          │  Sidebar (448px fixed)  │
 *   │  Ethereal figure + FloatingBar│  Modules + Agents      │
 *   │                              │                         │
 *   └──────────────────────────────┴─────────────────────────┘
 *
 * Sidebar = 448px (23.46% of 1907px Figma canvas).
 * Hero panel fills the remaining width.
 */
export default function App() {
  const handleStartSession = () => {
    console.log("[Imprint] Start Session clicked");
  };

  const handleAgentChange = (agentId) => {
    console.log("[Imprint] Agent selected:", agentId);
  };

  const handleModulesChange = (modulesMap) => {
    console.log("[Imprint] Modules updated:", Object.fromEntries(modulesMap));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-brand-dark">
      {/* ── Top Nav ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <main className="absolute inset-x-0 top-[56px] bottom-0 flex">
        {/* Left — Hero panel: fills remaining width */}
        <div className="relative min-w-0 flex-1">
          <HeroPanel
            agentName="STRATEGIST"
            onStartSession={handleStartSession}
          />
        </div>

        {/* Right — Sidebar: fixed 448px (Figma spec: 23.46% of 1907px) */}
        <div className="relative w-[448px] shrink-0">
          <Sidebar
            onStartSession={handleStartSession}
            onAgentChange={handleAgentChange}
            onModulesChange={handleModulesChange}
          />
        </div>
      </main>
    </div>
  );
}
