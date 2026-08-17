export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group flex items-baseline gap-2 ${className}`} aria-label="ALAS — на главную">
      <span className="font-display text-2xl leading-none font-semibold tracking-[0.14em]">
        ALAS
      </span>
      <span
        aria-hidden
        className="mb-0.5 size-1.5 animate-(--animate-spark) rounded-full bg-[var(--color-ember-500)]"
      />
      <span className="eyebrow hidden text-[0.6rem] sm:block">клининг · Алматы</span>
    </a>
  );
}
