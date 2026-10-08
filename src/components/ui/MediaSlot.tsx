import Image from "next/image";

/**
 * Слот под медиа. С `src` показывает картинку, без него — заглушку
 * с техзаданием на кадр, пока нет своего материала.
 */
export function MediaSlot({
  brief,
  src,
  alt = "",
  sizes = "(min-width: 1024px) 26rem, 82vw",
  ratio = "4 / 3",
  className = "",
  tone = "cool",
}: {
  brief: string;
  src?: string;
  alt?: string;
  sizes?: string;
  ratio?: string;
  className?: string;
  tone?: "cool" | "warm";
}) {
  if (src) {
    return (
      <div className={`media-frame ${className}`} style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`media-frame ${className}`} style={{ aspectRatio: ratio }}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            tone === "warm"
              ? "radial-gradient(120% 80% at 20% 15%, color-mix(in oklab, var(--color-ember-300) 22%, transparent), transparent 60%)"
              : "radial-gradient(120% 80% at 75% 10%, color-mix(in oklab, var(--color-glacier-400) 40%, transparent), transparent 62%)",
        }}
      />
      <div className="absolute inset-0 flex items-end p-5">
        <p className="eyebrow max-w-[26ch] text-[0.6rem] leading-relaxed">{brief}</p>
      </div>
      <div
        aria-hidden
        className="absolute top-5 right-5 size-8 rounded-full border border-[var(--hairline)]"
      />
    </div>
  );
}
