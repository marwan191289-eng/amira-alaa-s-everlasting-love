import { useEffect, useState } from "react";

export function SplashScreen() {
  const [hidden, setHidden] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2400);
    const t2 = setTimeout(() => setHidden(true), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, color-mix(in oklab, var(--gold) 12%, transparent), transparent 65%)",
      }}
      aria-hidden={leaving}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-6 md:gap-10">
          <h1
            className="font-display-ar text-5xl md:text-7xl font-bold text-gradient-gold splash-name splash-name-1"
          >
            أميرة
          </h1>
          <span className="font-display text-3xl md:text-4xl italic text-gold/80 splash-amp">
            &amp;
          </span>
          <h1
            className="font-display-ar text-5xl md:text-7xl font-bold text-gradient-gold splash-name splash-name-2"
          >
            علاء
          </h1>
        </div>

        <div className="mt-10 h-px w-56 overflow-hidden bg-gold/20 rounded-full">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent splash-bar" />
        </div>

        <p className="mt-6 font-display tracking-[0.5em] text-xs text-gold/70 splash-tag">
          A WEDDING TRIBUTE
        </p>
      </div>

      <style>{`
        .splash-name { opacity: 0; transform: translateY(20px); animation: splashIn .9s ease-out forwards; }
        .splash-name-1 { animation-delay: .15s; }
        .splash-name-2 { animation-delay: .55s; }
        .splash-amp { opacity: 0; animation: splashFade .8s ease-out .9s forwards; }
        .splash-tag { opacity: 0; animation: splashFade 1s ease-out 1.3s forwards; }
        .splash-bar { animation: splashSlide 1.4s ease-in-out infinite; }
        @keyframes splashIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes splashFade { to { opacity: 1; } }
        @keyframes splashSlide {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(420%); }
        }
      `}</style>
    </div>
  );
}
