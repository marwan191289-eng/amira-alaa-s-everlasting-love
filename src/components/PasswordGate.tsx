import { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { unlock } from "@/lib/wedding-auth";

interface Props {
  title?: string;
  description?: string;
  onUnlocked: () => void;
}

export function PasswordGate({ title, description, onUnlocked }: Props) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trim accidental spaces / RTL invisible chars.
    const clean = value.trim();
    if (unlock(clean)) {
      setError(null);
      setValue("");
      onUnlocked();
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border-2 border-dashed border-gold/40 bg-card/40 p-6 md:p-8 backdrop-blur text-center"
    >
      <Lock className="mx-auto h-8 w-8 text-gold mb-2" />
      <h4 className="font-display-ar text-2xl text-gold">
        {title ?? "مساحة خاصة بالعائلة"}
      </h4>
      <p className="mt-2 font-body-ar text-sm text-muted-foreground">
        {description ?? "أدخل كلمة المرور للتمكن من رفع أو حذف الذكريات"}
      </p>
      <div className="mt-5 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto">
        <div className="relative flex-1">
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="كلمة المرور"
            dir="ltr"
            autoComplete="current-password"
            autoFocus
            className="w-full rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 pr-11 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors text-center tracking-widest"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-gold transition-colors"
            aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-display-ar text-base text-primary-foreground transition-all hover:shadow-glow"
        >
          <KeyRound className="h-4 w-4" />
          فتح
        </button>
      </div>
      {error && (
        <p className="mt-3 font-body-ar text-sm text-destructive">{error}</p>
      )}
      <p className="mt-4 font-body-ar text-xs text-muted-foreground/70">
        تلميح: كلمة المرور حساسة لحالة الأحرف
      </p>
    </form>
  );
}
