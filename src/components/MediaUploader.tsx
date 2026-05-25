import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, ImagePlus, Globe, Lock } from "lucide-react";

interface Props {
  onUploaded?: () => void;
}

type Visibility = "public" | "private";

export function MediaUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [uploader, setUploader] = useState("");
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let done = 0;
    for (const file of Array.from(files)) {
      try {
        const isVideo = file.type.startsWith("video/");
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${isVideo ? "videos" : "images"}/${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("wedding-media")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;

        const { error: dbErr } = await supabase.from("media").insert({
          path,
          type: isVideo ? "video" : "image",
          caption: caption || null,
          uploader: uploader || null,
          visibility,
        });
        if (dbErr) throw dbErr;

        done += 1;
        setProgress({ done, total: files.length });
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ أثناء الرفع");
        break;
      }
    }

    setUploading(false);
    if (done > 0) {
      setSuccess(`تم رفع ${done} ملف بنجاح ✦`);
      setCaption("");
      onUploaded?.();
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-3xl border-2 border-dashed border-gold/40 bg-card/40 p-6 md:p-8 backdrop-blur">
      <div className="text-center mb-6">
        <ImagePlus className="mx-auto h-8 w-8 text-gold mb-2" />
        <h4 className="font-display-ar text-2xl text-gold">شارك ذكرى</h4>
        <p className="mt-2 font-body-ar text-sm text-muted-foreground">
          ارفع صورك وفيديوهاتك لتُضاف إلى ألبوم العرس مباشرة
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <input
          type="text"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
          placeholder="اسمك (اختياري)"
          className="rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 font-body-ar text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
          disabled={uploading}
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="تعليق على الذكرى (اختياري)"
          className="rounded-xl border border-gold/30 bg-background/60 px-4 py-2.5 font-body-ar text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
          disabled={uploading}
        />
      </div>

      <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-background/40 p-1 border border-gold/20">
        <button
          type="button"
          onClick={() => setVisibility("public")}
          disabled={uploading}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-body-ar text-sm transition-all ${
            visibility === "public"
              ? "bg-gold text-primary-foreground shadow-glow"
              : "text-muted-foreground hover:text-gold"
          }`}
        >
          <Globe className="h-4 w-4" /> عامة — يراها الجميع
        </button>
        <button
          type="button"
          onClick={() => setVisibility("private")}
          disabled={uploading}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-body-ar text-sm transition-all ${
            visibility === "private"
              ? "bg-gold text-primary-foreground shadow-glow"
              : "text-muted-foreground hover:text-gold"
          }`}
        >
          <Lock className="h-4 w-4" /> خاصة — للعائلة فقط
        </button>
      </div>


      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group w-full inline-flex items-center justify-center gap-3 rounded-full border border-gold/60 bg-gold/10 px-6 py-3 font-display-ar text-base text-gold transition-all hover:bg-gold hover:text-primary-foreground hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            جارٍ الرفع {progress ? `(${progress.done}/${progress.total})` : "..."}
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            اختر الصور والفيديوهات
          </>
        )}
      </button>

      {error && (
        <p className="mt-4 text-center font-body-ar text-sm text-destructive">{error}</p>
      )}
      {success && !error && (
        <p className="mt-4 text-center font-body-ar text-sm text-gold">{success}</p>
      )}
    </div>
  );
}
