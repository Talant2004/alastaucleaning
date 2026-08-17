import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/contact";
import { COMPANY, privacyContact } from "@/lib/company";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — ALAS",
  description:
    "Как ALAS обрабатывает имя, телефон и адрес при заказе уборки: зачем собираем, сколько храним и как удалить по запросу.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const contact = privacyContact();

export default function PrivacyPage() {
  return (
    <article className="shell py-28 md:py-36">
      <p className="eyebrow">Документы</p>
      <h1 className="h1 mt-5 max-w-[18ch]">Политика конфиденциальности</h1>
      <p className="muted mt-5 max-w-[56ch]">
        Коротко и по делу: какие данные мы берём при заказе уборки, зачем они нужны и как их удалить.
      </p>

      <div className="mt-14 max-w-[68ch] space-y-12">
        <Section title="Кто обрабатывает данные">
          <p>
            {COMPANY.legalName}
            {COMPANY.iin ? `, ИИН ${COMPANY.iin}` : ""}, {COMPANY.address}.
          </p>
          <p className="mt-3">
            Связаться можно по телефону{" "}
            <a href={`tel:${CONTACT.phoneTel}`} className="nums underline-offset-4 hover:underline">
              {CONTACT.phoneDisplay}
            </a>
            {contact.kind === "email" ? (
              <>
                {" "}
                или по e-mail{" "}
                <a href={`mailto:${contact.value}`} className="underline-offset-4 hover:underline">
                  {contact.value}
                </a>
              </>
            ) : (
              <> или в WhatsApp на тот же номер</>
            )}
            .
          </p>
        </Section>

        <Section title="Какие данные собираем">
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>имя или как к вам обращаться;</li>
            <li>номер телефона;</li>
            <li>адрес объекта уборки;</li>
            <li>желаемые дата и время, тип и состав услуг из калькулятора.</li>
          </ul>
          <p className="mt-3">
            Мы не просим паспорт, ИИН клиента, данные банковской карты на сайте и не снимаем доступ к
            камере или микрофону браузера.
          </p>
        </Section>

        <Section title="Зачем они нужны">
          <p>
            Только чтобы выполнить заказ: подтвердить бронь, прислать карточку клинера, приехать по
            адресу, связаться при уточнениях и выслать договор / чек. Данные не используем для
            рассылок «ради интереса» и не продаём.
          </p>
        </Section>

        <Section title="Как получаем">
          <p>
            Вы сами оставляете их в форме бронирования на сайте или пишете в WhatsApp. Часть
            технических данных (например, cookie аналитики, если счётчики подключены) может
            собираться автоматически — только для статистики работы сайта.
          </p>
        </Section>

        <Section title="Сколько храним">
          <p>
            Заявки и переписку по заказу храним до 12 месяцев после последней уборки — на случай
            гарантии и повторного обращения. Договор и закрывающие документы для компаний — в сроки,
            которые требует законодательство Казахстана по бухгалтерскому учёту.
          </p>
        </Section>

        <Section title="Кому передаём">
          <p>
            Третьим лицам не передаём и не продаём. Исключения: если вы сами попросили (например,
            выставить счёт на компанию) или этого требует закон. Клинерам передаём только то, что
            нужно для выезда: адрес, время, состав работ и ваши пожелания по дому.
          </p>
        </Section>

        <Section title="Как удалить или исправить">
          <p>
            Напишите в WhatsApp на{" "}
            <span className="nums">{CONTACT.phoneDisplay}</span>
            {contact.kind === "email" ? (
              <>
                {" "}
                или на e-mail{" "}
                <a href={`mailto:${contact.value}`} className="underline-offset-4 hover:underline">
                  {contact.value}
                </a>
              </>
            ) : null}{" "}
            с просьбой удалить или поправить данные. Сделаем в разумный срок, обычно в течение 7
            дней, кроме сведений, которые обязаны хранить по закону (например, закрытые акты для
            бухгалтерии).
          </p>
        </Section>

        <Section title="Согласие">
          <p>
            Отправляя заявку с сайта или продолжая переписку по заказу, вы соглашаетесь на обработку
            указанных данных на условиях этой политики. Отозвать согласие можно тем же способом, что
            и запрос на удаление.
          </p>
        </Section>

        <p className="eyebrow text-[0.65rem] leading-relaxed">
          Редакция от {new Date().toLocaleDateString("ru-KZ", { year: "numeric", month: "long", day: "numeric" })}.
          При существенных изменениях обновим текст на этой странице.
        </p>
      </div>

      <p className="mt-16">
        <Link href="/" className="btn btn-ghost">
          На главную
        </Link>
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--hairline)] pt-8">
      <h2 className="h3 text-xl">{title}</h2>
      <div className="muted mt-4 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
