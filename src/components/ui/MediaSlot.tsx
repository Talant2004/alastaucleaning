/**
 * Слот под съёмку. Пока нет своего материала — показываем аккуратную заглушку
 * с техзаданием на кадр. Стоковые фото не используем принципиально.
 */
export function MediaSlot({
  brief,
  ratio = "4 / 3",
  className = "",
  tone = "cool",
}: {
  brief: string;
  ratio?: string;
  className?: string;
  tone?: "cool" | "warm";
}) {
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
