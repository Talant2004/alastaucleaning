import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/contact";
import { COMPANY, privacyContact } from "@/lib/company";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: `${t("h1")} — ALAS`,
    description: t("intro"),
    alternates: { canonical: `/${locale}/privacy` },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const contact = privacyContact();
  const kz = locale === "kz";

  return (
    <article className="shell py-28 md:py-36">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="h1 mt-5 max-w-[18ch]">{t("h1")}</h1>
      <p className="muted mt-5 max-w-[56ch]">{t("intro")}</p>

      <div className="mt-14 max-w-[68ch] space-y-12">
        <Section title={kz ? "Деректерді кім өңдейді" : "Кто обрабатывает данные"}>
          <p>
            {COMPANY.legalName}
            {COMPANY.iin ? `, ИИН ${COMPANY.iin}` : ""}, {COMPANY.address}.
          </p>
          <p className="mt-3">
            {kz ? "Байланыс:" : "Связаться можно по телефону"}{" "}
            <a href={`tel:${CONTACT.phoneTel}`} className="nums underline-offset-4 hover:underline">
              {CONTACT.phoneDisplay}
            </a>
            {contact.kind === "email" ? (
              <>
                {" "}
                /{" "}
                <a href={`mailto:${contact.value}`} className="underline-offset-4 hover:underline">
                  {contact.value}
                </a>
              </>
            ) : (
              <> {kz ? "немесе WhatsApp" : "или в WhatsApp на тот же номер"}</>
            )}
            .
          </p>
        </Section>

        <Section title={kz ? "Қандай деректерді жинаймыз" : "Какие данные собираем"}>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>{kz ? "аты немесе қалай жүгіну;" : "имя или как к вам обращаться;"}</li>
            <li>{kz ? "телефон нөмірі;" : "номер телефона;"}</li>
            <li>{kz ? "тазалау объектісінің мекенжайы;" : "адрес объекта уборки;"}</li>
            <li>
              {kz
                ? "күні мен уақыты, калькулятордағы қызмет құрамы."
                : "желаемые дата и время, тип и состав услуг из калькулятора."}
            </li>
          </ul>
        </Section>

        <Section title={kz ? "Не үшін керек" : "Зачем они нужны"}>
          <p>
            {kz
              ? "Тек тапсырысты орындау үшін: броньды растау, клинер карточкасын жіберу, мекенжайға келу. Деректерді сатпаймыз."
              : "Только чтобы выполнить заказ: подтвердить бронь, прислать карточку клинера, приехать по адресу. Данные не продаём."}
          </p>
        </Section>

        <Section title={kz ? "Қанша сақтаймыз" : "Сколько храним"}>
          <p>
            {kz
              ? "Тапсырыс пен хат алмасуды соңғы тазалаудан кейін 12 айға дейін сақтаймыз."
              : "Заявки и переписку по заказу храним до 12 месяцев после последней уборки."}
          </p>
        </Section>

        <Section title={kz ? "Кімге береміз" : "Кому передаём"}>
          <p>
            {kz
              ? "Үшінші тұлғаларға бермейміз және сатпаймыз. Клинерлерге тек шығуға қажетті мәліметтер беріледі."
              : "Третьим лицам не передаём и не продаём. Клинерам — только то, что нужно для выезда."}
          </p>
        </Section>

        <Section title={kz ? "Қалай жоюға болады" : "Как удалить или исправить"}>
          <p>
            {kz ? "WhatsApp-қа жазыңыз:" : "Напишите в WhatsApp на"}{" "}
            <span className="nums">{CONTACT.phoneDisplay}</span>.{" "}
            {kz ? "Әдетте 7 күн ішінде орындаймыз." : "Сделаем в разумный срок, обычно в течение 7 дней."}
          </p>
        </Section>
      </div>

      <p className="mt-16">
        <Link href="/" className="btn btn-ghost">
          {t("home")}
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
