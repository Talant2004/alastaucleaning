import Link from "next/link";
import { WA_TEXTS } from "@/lib/contact";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-5 max-w-[18ch]">Такой страницы нет, а чистота — есть</h1>
      <p className="muted mt-6 max-w-[46ch]">
        Ссылка могла устареть или в адресе опечатка. Вернитесь на главную — или напишите нам, поможем
        с расчётом уборки.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/" className="btn btn-primary">
          На главную
        </Link>
        <WhatsAppButton
          source="footer"
          text={WA_TEXTS.footer}
          label="Написать в WhatsApp"
          variant="brass"
        />
      </div>
    </section>
  );
}
