import heroFigure from "../assets/images/hero-figure.png";
import heroOverlay from "../assets/images/hero-overlay.png";
import FloatingBar from "./FloatingBar";

/**
 * HeroPanel — Left panel with ethereal figure image + floating bar
 *
 * Takes up ~76.5% of the viewport width (below the nav).
 * Background: #0f0f0f with right border #2a2a2a
 * Image layers: hero-figure.png (base) + hero-overlay.png (glow/gradient)
 *
 * @param {Object}   props
 * @param {string}   [props.agentName]    – Name shown in floating bar
 * @param {Function} [props.onStartSession]
 */
export default function HeroPanel({ agentName = "STRATEGIST", onStartSession }) {
  return (
    <div className="relative h-full overflow-hidden border-r border-neutral-800 bg-brand-panel">
      {/* ── Image layers ── */}
      <div className="absolute inset-0">
        <img
          src={heroFigure}
          alt="AI Strategist figure"
          className="absolute inset-0 h-full w-[103.7%] max-w-none object-cover"
          style={{ left: "-1.88%", top: "-0.05%" }}
        />
        <img
          src={heroOverlay}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      {/* ── Floating bar ── */}
      <FloatingBar agentName={agentName} onStartSession={onStartSession} />
    </div>
  );
}
