import { useEffect, useState } from "react";
import { Palette, Check } from "lucide-react";

// Each theme overrides the CSS variables defined in styles.css.
// "wine" is the original (default) wedding palette.
type ThemeKey = "wine" | "midnight" | "emerald" | "noir";

interface Theme {
  key: ThemeKey;
  name: string;
  swatch: string;
  vars: Record<string, string>;
}

const THEMES: Theme[] = [
  {
    key: "wine",
    name: "نبيذ ملكي",
    swatch: "#7a1f2b",
    vars: {
      "--background": "oklch(0.18 0.045 25)",
      "--foreground": "oklch(0.92 0.04 60)",
      "--card": "oklch(0.22 0.055 24)",
      "--muted": "oklch(0.26 0.05 25)",
      "--muted-foreground": "oklch(0.78 0.05 70)",
      "--primary": "oklch(0.82 0.13 75)",
      "--gold": "oklch(0.82 0.13 75)",
      "--gold-soft": "oklch(0.90 0.10 80)",
      "--rose": "oklch(0.78 0.09 35)",
    },
  },
  {
    key: "midnight",
    name: "ليلة زرقاء",
    swatch: "#0f1e3d",
    vars: {
      "--background": "oklch(0.17 0.04 260)",
      "--foreground": "oklch(0.93 0.03 80)",
      "--card": "oklch(0.22 0.05 260)",
      "--muted": "oklch(0.26 0.04 260)",
      "--muted-foreground": "oklch(0.78 0.04 80)",
      "--primary": "oklch(0.86 0.11 85)",
      "--gold": "oklch(0.86 0.11 85)",
      "--gold-soft": "oklch(0.92 0.09 90)",
      "--rose": "oklch(0.74 0.10 320)",
    },
  },
  {
    key: "emerald",
    name: "زمرّد فاخر",
    swatch: "#0d3b2e",
    vars: {
      "--background": "oklch(0.18 0.05 165)",
      "--foreground": "oklch(0.93 0.03 90)",
      "--card": "oklch(0.22 0.055 165)",
      "--muted": "oklch(0.26 0.05 165)",
      "--muted-foreground": "oklch(0.78 0.04 90)",
      "--primary": "oklch(0.84 0.12 85)",
      "--gold": "oklch(0.84 0.12 85)",
      "--gold-soft": "oklch(0.92 0.10 90)",
      "--rose": "oklch(0.76 0.08 30)",
    },
  },
  {
    key: "noir",
    name: "أسود وذهب",
    swatch: "#0a0a0a",
    vars: {
      "--background": "oklch(0.12 0.005 0)",
      "--foreground": "oklch(0.94 0.02 80)",
      "--card": "oklch(0.18 0.01 60)",
      "--muted": "oklch(0.22 0.01 60)",
      "--muted-foreground": "oklch(0.78 0.03 80)",
      "--primary": "oklch(0.85 0.13 80)",
      "--gold": "oklch(0.85 0.13 80)",
      "--gold-soft": "oklch(0.93 0.10 85)",
      "--rose": "oklch(0.75 0.08 30)",
    },
  },
];

const STORAGE_KEY = "wedding-theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeKey>("wine");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeKey | null) ?? "wine";
    const theme = THEMES.find((t) => t.key === saved) ?? THEMES[0];
    setActive(theme.key);
    applyTheme(theme);
  }, []);

  const pick = (theme: Theme) => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme.key);
    setActive(theme.key);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div className="mb-3 rounded-2xl border border-gold/40 bg-card/95 p-3 shadow-elegant backdrop-blur">
          <p className="mb-2 text-center font-display-ar text-xs text-muted-foreground">
            اختر لون الموقع
          </p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => pick(t)}
                className={`group flex items-center gap-2 rounded-xl border px-2 py-2 text-right transition-all ${
                  active === t.key
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 hover:border-gold/60"
                }`}
              >
                <span
                  className="h-6 w-6 shrink-0 rounded-full border border-gold/30"
                  style={{ background: t.swatch }}
                />
                <span className="flex-1 font-body-ar text-xs text-foreground">
                  {t.name}
                </span>
                {active === t.key && (
                  <Check className="h-3 w-3 text-gold" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-card/80 text-gold shadow-elegant backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-glow"
        aria-label="تغيير لون الموقع"
        title="تغيير لون الموقع"
      >
        <Palette className="h-5 w-5" />
      </button>
    </div>
  );
}
