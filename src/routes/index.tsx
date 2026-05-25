import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "أميرة و علاء — حكاية تبدأ | Amira & Alaa" },
      {
        name: "description",
        content:
          "موقع تذكاري راقٍ لحفل زفاف أميرة وعلاء — صور، فيديوهات، ورسائل حب من العائلة.",
      },
      { property: "og:title", content: "أميرة و علاء — حكاية تبدأ" },
      {
        property: "og:description",
        content: "هدية زفاف رقمية لأختي العزيزة أميرة وزوجها علاء.",
      },
      { property: "og:image", content: heroBg },
      { property: "og:type", content: "website" },
    ],
  }),
});

// ============================================================================
// MEDIA — استبدل هذه المصفوفات بصور وفيديوهات أختك الحقيقية
// Just drop files in src/assets/ and replace the imports / URLs below.
// ============================================================================

const galleryImages: { src: string; caption?: string }[] = [
  { src: g1, caption: "لحظات أنيقة" },
  { src: g6, caption: "حفل ملكي" },
  { src: g2, caption: "خاتم العمر" },
  { src: g3, caption: "ضوء الشموع" },
  { src: g5, caption: "حلاوة اليوم" },
  { src: g4, caption: "زخرفة الفرح" },
];

const videos: { url: string; poster: string; title: string }[] = [
  // مثال — أضف فيديوهاتك هنا
  // { url: "/videos/opening.mp4", poster: g1, title: "فيديو الافتتاح" },
];

// ============================================================================

const marwanMessage = `مروان نجم لأخته وحبيبته العروسة أجمل وأرقى أميرة نجم

عايزك بس تكوني متأكدة أني والله ما منعني عن حضور غير العذر القهري، الخارج عن الإرادة المنفردة، بس أكيد في يوم من الأيام هنتقابل وهقدر أشرحلك الموقف كامل.
سامحيني يا حبيبتي.

وسلامي لعلاء زوجك.
أترككم في رعاية الله وحفظه.
ألف مبروك يا أميرة، وربنا يسعدك ويبارك في عمرك.

مع أطيب التمنيات،
مروان نجم`;

const saraMessage = `تهنئة سارة نجم وحمزة نجم

مبروك يا الأميرة عمتو! أتمنالك السعادة والتوفيق في كل لحظات حياتك الجاية. السلام لحين اللقاء يا حبيبة قلبي أنا وحمزة، أنا بتكلم بلساني وبلسان حمزة علشان هو لسه صغير ومبيعرفش يتكلم.

مروان دايماً يقولي إني نسخة منك وأنا بقوله لأ، هي أجمل كتير بصراحة، بس لما شفت الفيديوهات والصور حسيت إن فعلاً ممكن أكون أنا في يوم من الأيام شبهك، وده أكيد هيكون أكبر ضربة حظ ليا في حياتي إني أكون حتى في نص جمالك يا الأميرة أميرة. بحبك أوي يا عمتو، وحمزة بيقولك "ها اه اه"، أكيد يقصد إنه بيحبك هو كمان. مين يشوفك ومايحبكيش يا عمتو؟

(ملحوظة: متستغربيش إني بناديه باسمه، احنا أصحاب. أنا بقوله "يا بابا" بس لما بيكون زعلان مني، لأننا ساعتها مبنبقاش صحاب.)

السلام لحين اللقاء.
باي باي يا الأميرة عمتو أميرة.

بحبك جداً وحمزة كمان بيحبك جداً.`;

function Index() {
  // RTL by default — set on <html> so global layout flips correctly
  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
    document.body.setAttribute("dir", "rtl");
    return () => {
      document.documentElement.removeAttribute("dir");
      document.body.removeAttribute("dir");
    };
  }, []);

  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="min-h-screen text-foreground">
      {/* ============== HERO ============== */}
      <header className="relative isolate overflow-hidden">
        <img
          src={heroBg}
          alt="خلفية احتفالية أنيقة"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-veil)" }}
        />

        <div className="mx-auto max-w-5xl px-6 pt-20 pb-28 text-center md:pt-32 md:pb-40">
          <p className="font-display-ar text-sm tracking-[0.45em] text-gold uppercase fade-in-up">
            مروان نجم يُقدِّم
          </p>

          <div className="mt-10 flex flex-col items-center fade-in-up">
            <h1 className="font-display-ar text-6xl font-bold leading-none text-gradient-gold md:text-8xl">
              أميرة
            </h1>
            <span className="my-4 font-display text-2xl italic text-rose md:text-3xl" style={{ color: "var(--rose)" }}>
              &amp;
            </span>
            <h1 className="font-display-ar text-6xl font-bold leading-none text-gradient-gold md:text-8xl">
              علاء
            </h1>
          </div>

          <div className="mx-auto mt-10 h-px w-40 gold-divider" />

          <p className="ornament mx-auto mt-8 max-w-2xl font-body-ar text-lg text-muted-foreground md:text-xl">
            حكاية حب تبدأ، ومرجعٌ خالد لذكرى الفرح
          </p>

          <p className="mt-6 font-display tracking-widest text-sm text-gold/80">
            A WEDDING TRIBUTE • ٢٠٢٦
          </p>

          <a
            href="#gallery"
            className="mt-14 inline-flex items-center gap-3 rounded-full border border-gold/60 bg-card/40 px-8 py-3 font-body-ar text-base text-gold backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-glow"
          >
            ابدأ الرحلة
            <span className="text-lg">↓</span>
          </a>
        </div>
      </header>

      {/* ============== CELEBRATION ============== */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-display tracking-[0.4em] text-xs text-gold/80 uppercase">
          Celebration
        </p>
        <h2 className="mt-4 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
          احتفالٌ بالأميرة أميرة
        </h2>
        <div className="mx-auto mt-6 h-px w-24 gold-divider" />
        <p className="mt-8 font-body-ar text-lg leading-loose text-muted-foreground">
          في هذا اليوم المبارك، نجتمع — ولو من بعيد — لنحتفي بكِ يا أميرة، وبشريك
          عمركِ علاء. هذا الموقع هديّة من القلب: مرجعٌ تعودين إليه دائماً لترَيْ
          كم أنتِ محبوبة، وكم كانت لحظات يومكِ ساحرة.
        </p>
      </section>

      {/* ============== GALLERY ============== */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 text-center">
          <p className="font-display tracking-[0.4em] text-xs text-gold/80 uppercase">
            Gallery
          </p>
          <h3 className="mt-3 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            لحظاتٌ لا تُنسى
          </h3>
          <div className="mx-auto mt-5 h-px w-20 gold-divider" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(img.src)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-elegant transition-all hover:border-gold hover:shadow-glow"
            >
              <img
                src={img.src}
                alt={img.caption ?? `صورة ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {img.caption && (
                <span className="absolute bottom-3 right-4 left-4 font-display-ar text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  {img.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ============== VIDEOS ============== */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-14 text-center">
          <p className="font-display tracking-[0.4em] text-xs text-gold/80 uppercase">
            Memories
          </p>
          <h3 className="mt-3 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            رسائلٌ بالفيديو
          </h3>
          <div className="mx-auto mt-5 h-px w-20 gold-divider" />
        </div>

        {videos.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gold/40 bg-card/40 p-12 text-center">
            <p className="font-display-ar text-xl text-gold">
              ✦ أضف فيديوهات الزفاف هنا ✦
            </p>
            <p className="mt-4 font-body-ar text-muted-foreground">
              ارفع فيديوهاتك إلى مجلد <code className="rounded bg-secondary px-2 py-1 text-gold">public/videos/</code>{" "}
              ثم أضفها إلى مصفوفة <code className="rounded bg-secondary px-2 py-1 text-gold">videos</code> في
              ملف <code className="rounded bg-secondary px-2 py-1 text-gold">src/routes/index.tsx</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {videos.map((v, i) => (
              <figure key={i} className="overflow-hidden rounded-3xl border-2 border-gold/40 shadow-elegant">
                <div className="aspect-video bg-black">
                  <video controls poster={v.poster} className="h-full w-full" preload="metadata">
                    <source src={v.url} type="video/mp4" />
                  </video>
                </div>
                <figcaption className="bg-card px-6 py-4 text-center font-display-ar text-lg text-gold">
                  {v.title}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* ============== MESSAGES ============== */}
      <section className="mx-auto max-w-4xl space-y-10 px-6 py-20">
        <div className="mb-6 text-center">
          <p className="font-display tracking-[0.4em] text-xs text-gold/80 uppercase">
            Letters
          </p>
          <h3 className="mt-3 font-display-ar text-4xl font-bold text-gradient-gold md:text-5xl">
            رسائل من القلب
          </h3>
          <div className="mx-auto mt-5 h-px w-20 gold-divider" />
        </div>

        <article className="relative rounded-3xl border-2 border-gold/40 bg-card/70 p-8 backdrop-blur md:p-12 shadow-elegant">
          <div className="absolute -top-4 right-8 rounded-full bg-background px-4 py-1 font-display-ar text-sm text-gold border border-gold/50">
            ✉︎ رسالة مروان
          </div>
          <p className="whitespace-pre-wrap font-body-ar text-base leading-loose text-foreground/90 md:text-lg">
            {marwanMessage}
          </p>
          <p className="mt-8 text-left font-display-ar text-xl text-gold">— مروان نجم</p>
        </article>

        <article className="relative rounded-3xl border-2 border-gold/40 bg-card/70 p-8 backdrop-blur md:p-12 shadow-elegant">
          <div className="absolute -top-4 right-8 rounded-full bg-background px-4 py-1 font-display-ar text-sm text-gold border border-gold/50">
            ✦ رسالة سارة وحمزة
          </div>
          <p className="whitespace-pre-wrap font-body-ar text-base leading-loose text-foreground/90 md:text-lg">
            {saraMessage}
          </p>
          <p className="mt-8 text-left font-display-ar text-xl text-gold">
            — سارة نجم &amp; حمزة نجم
          </p>
        </article>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="mt-20 border-t border-gold/30 bg-card/30 py-16 text-center">
        <p className="font-display-ar text-2xl text-gradient-gold">
          أميرة ❦ علاء
        </p>
        <div className="mx-auto my-6 h-px w-24 gold-divider" />
        <p className="font-body-ar text-sm text-muted-foreground">
          مع كل الحب والتمنيات — من العائلة
        </p>
        <p className="mt-6 font-display-ar text-lg text-gold">مروان نجم</p>
        <p className="font-display text-xs tracking-[0.3em] text-gold/60">
          MARWAN NEGM • 2026
        </p>
      </footer>

      {/* ============== LIGHTBOX ============== */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-background/95 p-6 backdrop-blur-lg fade-in-up"
        >
          <img
            src={lightbox}
            alt="معاينة"
            className="max-h-[90vh] max-w-[92vw] rounded-2xl border-2 border-gold/50 object-contain shadow-glow"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 left-6 rounded-full border border-gold/60 bg-card/80 px-4 py-2 font-display-ar text-gold hover:bg-gold hover:text-primary-foreground"
          >
            إغلاق ✕
          </button>
        </div>
      )}
    </div>
  );
}
