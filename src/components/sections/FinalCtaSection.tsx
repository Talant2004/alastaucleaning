import { CONTACT, WA_TEXTS } from "@/lib/contact";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneLink, WhatsAppButton } from "@/components/contact/WhatsAppButton";

export function FinalCtaSection() {
  return (
    <section data-theme-zone="night" className="relative overflow-hidden py-28 md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[var(--color-obsidian)]" />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
        style={{ background: "var(--color-ember-600)" }}
      />

      <div className="shell text-center">
        <Reveal>
          <p className="eyebrow text-[var(--color-brass)]">Готовы начать?</p>
          <h2 className="h2 mx-auto mt-6 max-w-[22ch]">
            Ваш дом заслуживает не уборку, а обновление
          </h2>
          <p className="muted mx-auto mt-6 max-w-[46ch]">
            Ответим в WhatsApp за {CONTACT.replyMinutes} минут. Работаем ежедневно с{" "}
            {CONTACT.hoursFrom}:00 до {CONTACT.hoursTo}:00.
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#calc" className="btn btn-primary">
              Рассчитать и забронировать
            </a>
            <WhatsAppButton
              source="final_cta"
              text={WA_TEXTS.finalCta}
              label="Написать в WhatsApp"
              variant="brass"
            />
          </div>

          <p className="mt-10">
            <span className="eyebrow block text-[0.6rem]">Или просто позвоните</span>
            <PhoneLink source="final_cta" className="mt-2 inline-block text-2xl" />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
