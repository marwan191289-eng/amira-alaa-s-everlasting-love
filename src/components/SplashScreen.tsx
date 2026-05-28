import { useEffect, useRef, useState } from "react";

// Splash: canvas fireworks + particle-text reveal of "أميرة & علاء" / "Alaa & Amira"
export function SplashScreen({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // ---- Particle text targets ----
    const text = lang === "ar" ? "أميرة  ❦  علاء" : "Alaa  ❦  Amira";
    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;
    const fontSize = Math.min(W() * 0.11, 140);
    off.width = W();
    off.height = H();
    octx.fillStyle = "#fff";
    octx.font = `700 ${fontSize}px ${lang === "ar" ? "Amiri, serif" : "'Playfair Display', serif"}`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(text, W() / 2, H() / 2);
    const imageData = octx.getImageData(0, 0, W(), H());

    type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; r: number; hue: number; alpha: number };
    const particles: P[] = [];
    const step = Math.max(4, Math.floor(fontSize / 22));
    for (let y = 0; y < H(); y += step) {
      for (let x = 0; x < W(); x += step) {
        const a = imageData.data[(y * W() + x) * 4 + 3];
        if (a > 128) {
          particles.push({
            x: Math.random() * W(),
            y: Math.random() * H(),
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            r: 1.3 + Math.random() * 1.1,
            hue: 35 + Math.random() * 25,
            alpha: 0,
          });
        }
      }
    }

    // ---- Fireworks ----
    type F = { x: number; y: number; vx: number; vy: number; life: number; hue: number; size: number; trail?: boolean };
    const fireworks: F[] = [];
    const sparks: F[] = [];

    const launch = () => {
      fireworks.push({
        x: Math.random() * W() * 0.8 + W() * 0.1,
        y: H(),
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(7 + Math.random() * 3),
        life: 1,
        hue: 30 + Math.random() * 30,
        size: 2.4,
        trail: true,
      });
    };

    const explode = (x: number, y: number, hue: number) => {
      const count = 70 + Math.floor(Math.random() * 50);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.1;
        const speed = 2 + Math.random() * 4;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: hue + Math.random() * 20 - 10,
          size: 1.6 + Math.random() * 1.2,
        });
      }
    };

    let launchTimer = 0;
    let start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      // fade trail
      ctx.fillStyle = "rgba(20, 10, 18, 0.22)";
      ctx.fillRect(0, 0, W(), H());

      // launch fireworks early (first 2.4s)
      if (t < 2.6) {
        launchTimer++;
        if (launchTimer % 12 === 0) launch();
      }

      // update fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.08;
        ctx.beginPath();
        ctx.fillStyle = `hsl(${f.hue}, 95%, 70%)`;
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        if (f.vy >= -1.5) {
          explode(f.x, f.y, f.hue);
          fireworks.splice(i, 1);
        }
      }

      // update sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.life -= 0.013;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.beginPath();
        ctx.fillStyle = `hsl(${s.hue}, 95%, ${55 + s.life * 25}%)`;
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // start text particles after 1.6s
      if (t > 1.6) {
        const ease = Math.min(1, (t - 1.6) / 1.4);
        for (const p of particles) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx = (p.vx + dx * 0.012) * 0.86;
          p.vy = (p.vy + dy * 0.012) * 0.86;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.min(1, p.alpha + 0.04);
          ctx.globalAlpha = p.alpha * (0.6 + 0.4 * ease);
          ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const leaveTimer = setTimeout(() => setLeaving(true), 4200);
    const hideTimer = setTimeout(() => setHidden(true), 5000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [lang]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at center, #1a0d12 0%, #0a0608 80%)" }}
      aria-hidden={leaving}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-16 text-center">
        <p
          className="font-display tracking-[0.5em] text-xs"
          style={{ color: "color-mix(in oklab, #d4a35a 80%, transparent)" }}
        >
          {lang === "ar" ? "حكاية تبدأ" : "A WEDDING TRIBUTE"}
        </p>
      </div>
    </div>
  );
}
