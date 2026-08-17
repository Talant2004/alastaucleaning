import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  {
    fear: "Страшно впускать в дом посторонних",
    answer:
      "До приезда вы получаете карточку клинера: фото, имя, стаж, проверенный паспорт и действующая медсправка. Состав команды не меняется без вашего согласия.",
    tag: "Верификация",
  },
  {
    fear: "А если испортят мебель или технику?",
    answer:
      "Договор с материальной ответственностью. Любое средство сначала тестируем на скрытом участке — на изнаночной стороне обивки или в углу за дверью.",
    tag: "Ответственность",
  },
  {
    fear: "Химия, резкий запах, аллергия",
    answer:
      "pH-нейтральные составы с сертификатами и паспортами безопасности — покажем до заказа. Для детских и аллергиков есть протокол без ароматизаторов.",
    tag: "Безопасность",
  },
  {
    fear: "Сделают быстро и «на отвали»",
    answer:
      "Приёмка по фото до и после каждой зоны. Что-то не устроило — переделываем в течение 48 часов бесплатно, без разговоров о доплате.",
    tag: "Гарантия",
  },
];

export function ObjectionsSection() {
  return (
    <section className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">Честно о главном</p>
        <h2 className="h2 mt-5 max-w-[24ch]">Мы знаем, почему вы годами убираете сами</h2>
        <p className="muted mt-5 max-w-[56ch]">
          Это четыре причины, из-за которых люди в Алматы не заказывают клининг. Вот что мы сделали
          с каждой из них.
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, index) => (
          <Reveal
            as="li"
            key={item.fear}
            index={index}
            className="surface group relative flex flex-col p-6 transition-transform duration-500 ease-[var(--ease-brand)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="eyebrow text-[0.6rem] text-[var(--color-brass)]">{item.tag}</span>

            <svg
              viewBox="0 0 40 40"
              aria-hidden
              className="mt-6 size-9 stroke-[var(--color-sage-600)]"
              fill="none"
              strokeWidth="1"
            >
              <circle cx="20" cy="20" r="18" className="opacity-40" />
              <path
                d="M12 21.5 17.5 27 28 14"
                className="origin-center transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-110"
              />
            </svg>

            <h3 className="h3 mt-6 text-xl">{item.fear}</h3>
            <p className="muted mt-3 text-sm leading-relaxed">{item.answer}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
