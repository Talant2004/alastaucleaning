import { CONTACT, WA_TEXTS } from "@/lib/contact";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";

const FAQ = [
  {
    q: "Обряд «Аластау» — это религиозный ритуал?",
    a: "Нет. Это народная традиция и забота о воздухе в доме: сушёный адыраспан веками использовали как природный антисептик. Никакой эзотерики, никаких обещаний «снять порчу». Если дым не подходит — сделаем версию с гидролатом адыраспана.",
  },
  {
    q: "Нужно ли мне быть дома во время уборки?",
    a: "Не обязательно. Многие оставляют ключи или встречают команду и уезжают. Мы присылаем фотоотчёт по зонам, а старший клинер на связи в WhatsApp всю уборку.",
  },
  {
    q: "У меня аллергия и маленький ребёнок. Это безопасно?",
    a: "Да, если предупредить заранее. Соберём протокол без ароматизаторов и агрессивных составов, используем pH-нейтральные средства и увеличим время проветривания. Обряд в этом случае предложим без дыма.",
  },
  {
    q: "Что если после уборки я найду недочёты?",
    a: "Скажите в течение 48 часов — вернёмся и переделаем бесплатно. Это условие прописано в договоре, а не обещание на словах.",
  },
  {
    q: "Как оплатить?",
    a: "Kaspi QR или перевод, банковская карта, наличные. Для компаний — безналичный расчёт с закрывающими документами.",
  },
  {
    q: "Работаете ли вы, если дома кошка или собака?",
    a: "Да. Скажите заранее — подберём средства без резкого запаха и договоримся, в какой комнате питомцу будет спокойнее во время работы.",
  },
  {
    q: "Сколько по времени занимает уборка?",
    a: "Влажная уборка 2-комнатной — около 3 часов, генеральная — 5–6, после ремонта — от 8. В калькуляторе вы сразу видите ориентир по времени и размеру команды.",
  },
  {
    q: "Мне сложно разобраться в калькуляторе. Можно просто спросить цену?",
    a: `Конечно. Напишите в WhatsApp на ${CONTACT.phoneDisplay} — задам три вопроса о квартире и назову точную сумму. Считать самому не нужно.`,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export function FaqSection() {
  return (
    <section id="faq" className="shell py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Вопросы</p>
          <h2 className="h2 mt-5">Вопросы, которые вы стесняетесь задать</h2>
          <p className="muted mt-5 max-w-[40ch] text-sm">
            Не нашли своего — спросите напрямую. Отвечаем сами, без скриптов и колл-центра.
          </p>
          <WhatsAppButton
            source="faq"
            text={WA_TEXTS.faq}
            label="Задать вопрос"
            variant="brass"
            className="mt-7"
          />
        </Reveal>

        <div>
          {FAQ.map((item, index) => (
            <Reveal as="div" key={item.q} index={index}>
              <details className="group border-b border-[var(--hairline)] py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="h3 text-lg">{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)] transition-transform duration-500 ease-[var(--ease-brand)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="muted mt-4 max-w-[62ch] text-sm leading-relaxed">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
