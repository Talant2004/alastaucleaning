import Link from "next/link";

/** Глобальный 404 вне локали — сразу ведём на /ru */
export default function RootNotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-5 max-w-[18ch]">Такой страницы нет, а чистота — есть</h1>
      <Link href="/ru" className="btn btn-primary mt-10 w-fit">
        На главную
      </Link>
    </section>
  );
}
