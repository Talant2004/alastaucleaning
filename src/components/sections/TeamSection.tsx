import { Reveal } from "@/components/ui/Reveal";
import { MediaSlot } from "@/components/ui/MediaSlot";

const TEAM = [
  { name: "Айгүл", role: "Старший клинер · супервайзер", years: 6, jobs: 412, rating: "4.99" },
  { name: "Дана", role: "Генеральная уборка, химчистка", years: 4, jobs: 218, rating: "4.98" },
  { name: "Мадина", role: "После ремонта, текстиль", years: 3, jobs: 176, rating: "4.97" },
  { name: "Ерасыл", role: "После ремонта, окна, высота", years: 5, jobs: 265, rating: "4.98" },
];

const BADGES = ["паспорт проверен", "медсправка", "обучение ALAS"];

const CHECKLIST = [
  { zone: "Кухня", points: 34, sample: "фасады, фартук, техника снаружи, мойка, смеситель, вытяжные решётки" },
  { zone: "Санузел", points: 28, sample: "кафель, швы, сантехника, зеркала, хром, вентиляция" },
  { zone: "Комнаты", points: 41, sample: "пыль сверху вниз, плинтусы, радиаторы, выключатели, двери, проёмы" },
  { zone: "Прихожая и балкон", points: 25, sample: "шкафы снаружи, зеркала, порог, остекление, пол" },
  { zone: "Финал и приёмка", points: 20, sample: "фотоотчёт по зонам, проветривание, обряд «Аластау»" },
];

export function TeamSection() {
  return (
    <section id="team" className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">Команда и протокол</p>
        <h2 className="h2 mt-5 max-w-[22ch]">Люди, которых вы впускаете в дом</h2>
        <p className="muted mt-5 max-w-[54ch]">
          Каждого клинера мы проверяем сами и показываем вам заранее — до того, как он подойдёт к
          вашей двери.
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((person, index) => (
          <Reveal as="li" key={person.name} index={index} className="surface overflow-hidden p-4">
            <MediaSlot
              brief={`ПОРТРЕТ: ${person.name}, форма из льна, светлый фон, мягкий свет, полуоборот`}
              ratio="3 / 4"
            />
            <h3 className="h3 mt-5 text-lg">{person.name}</h3>
            <p className="muted mt-1 text-xs">{person.role}</p>

            <dl className="nums mt-4 flex gap-4 text-xs">
              <div>
                <dt className="eyebrow text-[0.55rem]">Стаж</dt>
                <dd>{person.years} года</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.55rem]">Уборок</dt>
                <dd>{person.jobs}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.55rem]">Оценка</dt>
                <dd>{person.rating} ★</dd>
              </div>
            </dl>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {BADGES.map((badge) => (
                <li
                  key={badge}
                  className="eyebrow rounded-full border border-[color-mix(in_oklab,var(--color-brass)_50%,transparent)] px-2.5 py-1 text-[0.5rem]"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <h3 className="h2 text-3xl">Чек-лист из 148 пунктов</h3>
          <p className="muted mt-4 max-w-[48ch] text-sm">
            Клинер идёт по нему сверху вниз и отмечает каждую зону. Вы получаете фотоотчёт и видите,
            что именно сделано.
          </p>

          <ul className="mt-8">
            {CHECKLIST.map((item) => (
              <li
                key={item.zone}
                className="flex items-baseline justify-between gap-6 border-b border-[var(--hairline)] py-4"
              >
                <div>
                  <p className="text-sm font-medium">{item.zone}</p>
                  <p className="muted mt-1 text-xs">{item.sample}</p>
                </div>
                <span className="nums shrink-0 text-sm text-[var(--color-sage-600)]">
                  {item.points}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal index={1}>
          <h3 className="h2 text-3xl">Наша химия</h3>
          <p className="muted mt-4 max-w-[48ch] text-sm">
            pH-нейтральные профессиональные составы. Паспорта безопасности показываем до заказа — не
            после.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { title: "Универсальное · pH 7", note: "полы, поверхности, детские комнаты" },
              { title: "Обезжириватель · pH 11", note: "кухня, вытяжки, только твёрдые поверхности" },
              { title: "Кислотное для санузла · pH 2", note: "налёт и ржавчина, без хлора" },
              { title: "Экстракция текстиля", note: "гипоаллергенно, без ароматизаторов" },
            ].map((item) => (
              <li key={item.title} className="surface p-4">
                <p className="nums text-sm">{item.title}</p>
                <p className="muted mt-1.5 text-xs">{item.note}</p>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-6 text-[0.6rem] leading-relaxed">
            Аллергия, беременность, питомцы или маленькие дети — скажите заранее, соберём протокол
            без ароматизаторов и без агрессивной химии.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
