import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SplashScreen } from "@/components/SplashScreen";
import { MediaUploader } from "@/components/MediaUploader";
import { Play, Trash2, Lock, Globe } from "lucide-react";
import { PasswordGate } from "@/components/PasswordGate";
import { isUnlocked, lock } from "@/lib/wedding-auth";
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
        content: "ألبوم زفاف رقمي لأميرة وعلاء — شاركنا ذكرياتك.",
      },
      { property: "og:image", content: heroBg },
      { property: "og:type", content: "website" },
    ],
  }),
});

type DbMedia = {
  id: string;
  path: string;
  type: "image" | "video";
  caption: string | null;
  uploader: string | null;
  visibility: "public" | "private";
  created_at: string;
};

type GalleryItem = {
  id: string;
  src: string;
  caption?: string;
  uploader?: string;
  dbItem?: DbMedia;
};

type VideoItem = {
  id: string;
  url: string;
  title?: string;
  uploader?: string;
  dbItem?: DbMedia;
};

const STORAGE_BUCKET = "wedding-media";

const seedImages: GalleryItem[] = [
  { id: "seed-1", src: g1, caption: "لحظات أنيقة" },
  { id: "seed-2", src: g6, caption: "حفل ملكي" },
  { id: "seed-3", src: g2, caption: "خاتم العمر" },
  { id: "seed-4", src: g3, caption: "ضوء الشموع" },
  { id: "seed-5", src: g5, caption: "حلاوة اليوم" },
  { id: "seed-6", src: g4, caption: "زخرفة الفرح" },
];

const marwanMessage = `إلى أختي وحبيبتي العروسة، أرقى وأجمل أميرة نجم

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

function publicUrl(path: string) {
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

function Index() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dbMedia, setDbMedia] = useState<DbMedia[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(isUnlocked());
  }, []);

  const handleLock = () => {
    lock();
    setUnlocked(false);
  };

  const deleteMedia = useCallback(
    async (item: DbMedia) => {
      if (!unlocked) return;
      if (!confirm("هل أنت متأكد من حذف هذه الذكرى؟")) return;
      await supabase.storage.from(STORAGE_BUCKET).remove([item.path]);
      const { error } = await supabase.from("media").delete().eq("id", item.id);
      if (error) {
        alert("تعذر الحذف: " + error.message);
        return;
      }
      setDbMedia((prev) => prev.filter((m) => m.id !== item.id));
    },
    [unlocked],
  );

  const toggleVisibility = useCallback(
    async (item: DbMedia) => {
      if (!unlocked) return;
      const next: "public" | "private" =
        item.visibility === "public" ? "private" : "public";
      const { error } = await supabase
        .from("media")
        .update({ visibility: next })
        .eq("id", item.id);
      if (error) {
        alert("تعذر تغيير الحالة: " + error.message);
        return;
      }
      setDbMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, visibility: next } : m)),
      );
    },
    [unlocked],
  );

  const fetchMedia = useCallback(async () => {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setDbMedia(data as DbMedia[]);
  }, []);

  useEffect(() => {
    fetchMedia();
    const channel = supabase
      .channel("media-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "media" },
        () => fetchMedia(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMedia]);

  const visibleMedia = useMemo(
    () => (unlocked ? dbMedia : dbMedia.filter((m) => m.visibility === "public")),
    [dbMedia, unlocked],
  );

  const uploadedImages: GalleryItem[] = useMemo(
    () =>
      visibleMedia
        .filter((m) => m.type === "image")
        .map((m) => ({
          id: m.id,
          src: publicUrl(m.path),
          caption: m.caption ?? undefined,
          uploader: m.uploader ?? undefined,
          dbItem: m,
        })),
    [visibleMedia],
  );

  const uploadedVideos: VideoItem[] = useMemo(
    () =>
      visibleMedia
        .filter((m) => m.type === "video")
        .map((m) => ({
          id: m.id,
          url: publicUrl(m.path),
          title: m.caption ?? "ذكرى من العرس",
          uploader: m.uploader ?? undefined,
          dbItem: m,
        })),
    [visibleMedia],
  );

  const allImages = [...uploadedImages, ...seedImages];

  return (
    <div className="min-h-screen text-foreground">
      <SplashScreen />

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

        <div className="mx-auto max-w-5xl px-6 pt-24 pb-28 text-center md:pt-36 md:pb-40">
          <p className="font-display tracking-[0.45em] text-xs text-gold/80 uppercase fade-in-up">
            A Wedding Tribute
          </p>

          <div className="mt-10 flex flex-col items-center fade-in-up">
            <h1 className="font-display-ar text-6xl font-bold leading-none text-gradient-gold md:text-8xl">
              أميرة
            </h1>
            <span
              className="my-4 font-display text-2xl italic md:text-3xl"
              style={{ color: "var(--rose)" }}
            >
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
            ٢٠٢٦
          </p>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#gallery"
              className="inline-flex items-center gap-3 rounded-full border border-gold/60 bg-card/40 px-8 py-3 font-body-ar text-base text-gold backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-glow"
            >
              ابدأ الرحلة
              <span className="text-lg">↓</span>
            </a>
            <a
              href="#share"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-3 font-body-ar text-base text-primary-foreground transition-all hover:shadow-glow"
            >
              ✦ شارك ذكرى
            </a>
          </div>
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

      {/* ============== SHARE / UPLOAD ============== */}
      <section id="share" className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <p className="font-display tracking-[0.4em] text-xs text-gold/80 uppercase">
            Share a Memory
          </p>
          <h3 className="mt-3 font-display-ar text-3xl font-bold text-gradient-gold md:text-4xl">
            أضف صورك وفيديوهاتك
          </h3>
          <div className="mx-auto mt-4 h-px w-20 gold-divider" />
        </div>
        {unlocked ? (
          <>
            <MediaUploader onUploaded={fetchMedia} />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleLock}
                className="inline-flex items-center gap-2 text-xs font-body-ar text-muted-foreground hover:text-gold transition-colors"
              >
                <Lock className="h-3 w-3" /> قفل المساحة
              </button>
            </div>
          </>
        ) : (
          <PasswordGate onUnlocked={() => setUnlocked(true)} />
        )}
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
          {uploadedImages.length > 0 && (
            <p className="mt-4 font-body-ar text-sm text-muted-foreground">
              {uploadedImages.length} ذكرى من الضيوف ✦
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {allImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-elegant transition-all hover:border-gold hover:shadow-glow"
            >
              <button
                type="button"
                onClick={() => setLightbox(img.src)}
                className="absolute inset-0 h-full w-full"
                aria-label="عرض الصورة"
              >
                <img
                  src={img.src}
                  alt={img.caption ?? "صورة من العرس"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {(img.caption || img.uploader) && (
                  <div className="absolute bottom-0 right-0 left-0 p-4 text-right opacity-0 transition-opacity group-hover:opacity-100">
                    {img.caption && (
                      <p className="font-display-ar text-sm text-gold">{img.caption}</p>
                    )}
                    {img.uploader && (
                      <p className="font-body-ar text-xs text-muted-foreground">
                        — {img.uploader}
                      </p>
                    )}
                  </div>
                )}
              </button>
              {unlocked && img.dbItem && (
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 opacity-0 transition-all group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => deleteMedia(img.dbItem!)}
                    className="rounded-full bg-background/80 p-2 text-destructive backdrop-blur transition-all hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(img.dbItem!)}
                    className="rounded-full bg-background/80 p-2 text-gold backdrop-blur transition-all hover:bg-gold hover:text-primary-foreground"
                    aria-label={
                      img.dbItem.visibility === "public" ? "اجعلها خاصة" : "اجعلها عامة"
                    }
                    title={
                      img.dbItem.visibility === "public" ? "عامة — اضغط للإخفاء" : "خاصة — اضغط للإظهار"
                    }
                  >
                    {img.dbItem.visibility === "public" ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
              {unlocked && img.dbItem?.visibility === "private" && (
                <div className="absolute top-2 right-2 z-10 rounded-full bg-background/80 px-2 py-1 backdrop-blur flex items-center gap-1 text-xs font-body-ar text-gold">
                  <Lock className="h-3 w-3" /> خاصة
                </div>
              )}
            </div>
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

        {uploadedVideos.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gold/40 bg-card/40 p-12 text-center">
            <Play className="mx-auto mb-3 h-8 w-8 text-gold" />
            <p className="font-display-ar text-xl text-gold">
              لا توجد فيديوهات بعد
            </p>
            <p className="mt-3 font-body-ar text-muted-foreground">
              كن أول من يشارك فيديو من الحفل — ارفعه من قسم{" "}
              <a href="#share" className="text-gold underline-offset-4 hover:underline">
                «شارك ذكرى»
              </a>{" "}
              في الأعلى.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {uploadedVideos.map((v) => (
              <figure
                key={v.id}
                className="overflow-hidden rounded-3xl border-2 border-gold/40 shadow-elegant"
              >
                <div className="aspect-video bg-black">
                  <video
                    controls
                    className="h-full w-full"
                    preload="metadata"
                    playsInline
                  >
                    <source src={v.url} />
                  </video>
                </div>
                <figcaption className="bg-card px-6 py-4 text-center">
                  <p className="font-display-ar text-lg text-gold">{v.title}</p>
                  {v.uploader && (
                    <p className="mt-1 font-body-ar text-xs text-muted-foreground">
                      — {v.uploader}
                    </p>
                  )}
                  {unlocked && v.dbItem && (
                    <button
                      type="button"
                      onClick={() => deleteMedia(v.dbItem!)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-destructive/50 bg-destructive/10 px-4 py-1.5 font-body-ar text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" /> حذف
                    </button>
                  )}
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
        <p className="font-display-ar text-2xl text-gradient-gold">أميرة ❦ علاء</p>
        <div className="mx-auto my-6 h-px w-24 gold-divider" />
        <p className="font-body-ar text-sm text-muted-foreground">
          مع كل الحب والتمنيات — من العائلة
        </p>
        <p className="mt-6 font-display text-xs tracking-[0.3em] text-gold/60">
          2026
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
