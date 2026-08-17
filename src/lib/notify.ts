/** Уведомление владельцу в Telegram (дешевле WhatsApp Business API). */
export async function notifyOwnerTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 3900),
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      console.error("[telegram]", await res.text());
    }
  } catch (error) {
    console.error("[telegram]", error);
  }
}

export function formatBookingTelegram(input: {
  id: string;
  date: string;
  time: string;
  name?: string;
  phone?: string;
  address?: string;
  message: string;
  total: number;
}): string {
  return [
    "🆕 Новая заявка ALAS",
    `ID: ${input.id}`,
    `Дата: ${input.date} · ${input.time}`,
    input.name ? `Имя: ${input.name}` : null,
    input.phone ? `Тел: ${input.phone}` : null,
    input.address ? `Адрес: ${input.address}` : null,
    `Смета: ${input.total.toLocaleString("ru-KZ")} ₸`,
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");
}
