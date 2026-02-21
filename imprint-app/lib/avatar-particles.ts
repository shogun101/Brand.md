type MicState = 'READY' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';

interface Particle {
  angle: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  size: number;
  opacity: number;
  phase: number;
  baseOpacity: number;
}

export class AvatarParticles {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrame: number | null = null;
  private micState: MicState = 'READY';
  private audioLevel: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initParticles();
  }

  private initParticles() {
    const count = 60;
    this.particles = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.006,
      radiusX: 120 + Math.random() * 80,
      radiusY: 180 + Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0,
      phase: Math.random() * Math.PI * 2,
      baseOpacity: 0.05 + Math.random() * 0.1,
    }));
  }

  setMicState(state: MicState) {
    this.micState = state;
  }

  setAudioLevel(level: number) {
    this.audioLevel = level;
  }

  start() {
    this.animate();
  }

  stop() {
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  private animate() {
    this.animFrame = requestAnimationFrame(() => this.animate());
    this.draw();
  }

  private draw() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const speedMult =
      this.micState === 'LISTENING'
        ? 1.5 + this.audioLevel * 2
        : this.micState === 'PROCESSING'
        ? 0.3
        : this.micState === 'AI_SPEAKING'
        ? 1.2
        : 1;

    const spread =
      this.micState === 'LISTENING' ? 1 + this.audioLevel * 0.4 : 1;

    this.particles.forEach((p) => {
      p.angle += p.speed * speedMult;

      let rx = p.radiusX * spread;
      let ry = p.radiusY * spread;

      if (this.micState === 'PROCESSING') {
        rx = p.radiusX * 0.3;
        ry = p.radiusY * 0.3;
      }

      const x = cx + Math.cos(p.angle) * rx;
      const y = cy + Math.sin(p.angle) * ry;

      const pulseOpacity =
        this.micState === 'AI_SPEAKING'
          ? p.baseOpacity + Math.sin(p.phase + p.angle * 3) * 0.08 * (1 + this.audioLevel)
          : p.baseOpacity;

      const finalOpacity = Math.min(
        pulseOpacity * (this.micState === 'LISTENING' ? 1.5 : 1),
        0.4
      );

      // Base dot
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(237, 222, 200, ${finalOpacity})`;
      this.ctx.fill();

      // Amber halo on larger particles (AI speaking)
      if (p.size > 2 && this.micState === 'AI_SPEAKING') {
        this.ctx.beginPath();
        this.ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(217, 119, 6, ${finalOpacity * 0.15})`;
        this.ctx.fill();
      }
    });
  }
}
