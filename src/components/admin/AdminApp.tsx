"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { defaultPricing, type PricingOverrides } from "@/lib/pricing-overrides";
import type { BookingStatus } from "@/lib/bookings";
import { FALLBACK_SLOT_CAPACITY, FALLBACK_TIME_SLOTS } from "@/lib/slots";

type Tab = "bookings" | "pricing" | "slots" | "content";

type BookingRow = {
  id: string;
  date: string;
  time: string;
  name?: string;
  phone?: string;
  address?: string;
  status: BookingStatus;
  estimate?: { total?: number };
  message?: string;
};

type ContentRow = {
  id: string;
  name?: string;
  title?: string;
  text?: string;
  quote?: string;
  context?: string;
  published?: boolean;
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  done: "Готово",
  cancelled: "Отмена",
};

export function AdminApp() {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("bookings");

  useEffect(() => {
    if (!configured) {
      setAuthReady(true);
      return;
    }
    return onAuthStateChanged(getFirebaseAuth(), (next) => {
      setUser(next);
      setAuthReady(true);
    });
  }, [configured]);

  if (!configured) {
    return (
      <Shell>
        <p className="text-sm text-[var(--fg-muted)]">
          Firebase не настроен. Заполните `NEXT_PUBLIC_FIREBASE_*` и перезапустите сайт.
        </p>
      </Shell>
    );
  }

  if (!authReady) {
    return (
      <Shell>
        <p className="eyebrow">Загрузка…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="h3">Вход в админку ALAS</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Firebase Authentication → Email/Password. Создайте пользователя в Console.
        </p>
        <form
          className="mt-8 grid max-w-sm gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setAuthError("");
            try {
              await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
            } catch {
              setAuthError("Не удалось войти. Проверьте email и пароль.");
            }
          }}
        >
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Пароль" value={password} onChange={setPassword} type="password" />
          {authError ? <p className="text-sm text-[var(--color-ember-600)]">{authError}</p> : null}
          <button type="submit" className="btn btn-primary mt-2">
            Войти
          </button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="h3">Админка ALAS</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">{user.email}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => void signOut(getFirebaseAuth())}>
          Выйти
        </button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Разделы админки">
        {(
          [
            ["bookings", "Заявки"],
            ["pricing", "Цены"],
            ["slots", "Слоты"],
            ["content", "Кейсы и отзывы"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`hairline rounded-full px-4 py-2 text-sm ${
              tab === id ? "border-transparent bg-[var(--color-obsidian)] text-[var(--color-linen)]" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "bookings" ? <BookingsPanel /> : null}
        {tab === "pricing" ? <PricingPanel /> : null}
        {tab === "slots" ? <SlotsPanel /> : null}
        {tab === "content" ? <ContentPanel /> : null}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[var(--color-linen)] text-[var(--color-ink)]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="eyebrow text-[0.58rem]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="hairline mt-2 w-full rounded-[14px] bg-transparent px-3 py-2.5 outline-none focus:border-[var(--color-sage-600)]"
      />
    </label>
  );
}

function BookingsPanel() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(
        query(collection(getFirestoreDb(), "bookings"), orderBy("createdAt", "desc"), limit(50)),
      );
      setRows(
        snap.docs.map((item) => {
          const data = item.data() as DocumentData;
          return {
            id: item.id,
            date: String(data.date ?? ""),
            time: String(data.time ?? ""),
            name: data.name ? String(data.name) : "",
            phone: data.phone ? String(data.phone) : "",
            address: data.address ? String(data.address) : "",
            status: (data.status as BookingStatus) || "new",
            estimate: data.estimate,
            message: data.message ? String(data.message) : "",
          };
        }),
      );
    } catch {
      setError("Не удалось загрузить заявки. Проверьте Firestore rules и индекс createdAt.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="eyebrow">Заявки</h2>
        <button type="button" className="btn btn-ghost text-sm" onClick={() => void load()}>
          Обновить
        </button>
      </div>
      {loading ? <p className="mt-4 text-sm text-[var(--fg-muted)]">Загрузка…</p> : null}
      {error ? <p className="mt-4 text-sm text-[var(--color-ember-600)]">{error}</p> : null}
      <ul className="mt-4 grid gap-3">
        {rows.map((row) => (
          <li key={row.id} className="surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="nums text-sm">
                  {row.date} · {row.time}
                </p>
                <p className="mt-1 text-sm">
                  {row.name || "Без имени"}
                  {row.phone ? ` · ${row.phone}` : ""}
                </p>
                {row.address ? <p className="mt-1 text-xs text-[var(--fg-muted)]">{row.address}</p> : null}
                {row.estimate?.total != null ? (
                  <p className="nums mt-2 text-sm">{row.estimate.total.toLocaleString("ru-KZ")} ₸</p>
                ) : null}
              </div>
              <label className="text-sm">
                <span className="sr-only">Статус</span>
                <select
                  value={row.status}
                  onChange={async (event) => {
                    const status = event.target.value as BookingStatus;
                    await updateDoc(doc(getFirestoreDb(), "bookings", row.id), { status });
                    setRows((prev) =>
                      prev.map((item) => (item.id === row.id ? { ...item, status } : item)),
                    );
                  }}
                  className="hairline rounded-full bg-transparent px-3 py-2"
                >
                  {(Object.keys(STATUS_LABEL) as BookingStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {row.message ? (
              <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap text-xs text-[var(--fg-muted)]">
                {row.message}
              </pre>
            ) : null}
          </li>
        ))}
      </ul>
      {!loading && !rows.length ? (
        <p className="mt-4 text-sm text-[var(--fg-muted)]">Заявок пока нет.</p>
      ) : null}
    </section>
  );
}

function PricingPanel() {
  const defaults = useMemo(() => defaultPricing(), []);
  const [wet, setWet] = useState(String(defaults.perM2.wet));
  const [general, setGeneral] = useState(String(defaults.perM2.general));
  const [postRepair, setPostRepair] = useState(String(defaults.perM2.postRepair));
  const [balconyFlat, setBalconyFlat] = useState(String(defaults.balconyFlat));
  const [alastau, setAlastau] = useState(
    defaults.alastauOptionPrice === null ? "" : String(defaults.alastauOptionPrice),
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getDoc(doc(getFirestoreDb(), "settings", "pricing")).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as PricingOverrides;
      if (data.wet != null) setWet(String(data.wet));
      if (data.general != null) setGeneral(String(data.general));
      if (data.postRepair != null) setPostRepair(String(data.postRepair));
      if (data.balconyFlat != null) setBalconyFlat(String(data.balconyFlat));
      if (data.alastauOptionPrice === null) setAlastau("");
      else if (data.alastauOptionPrice != null) setAlastau(String(data.alastauOptionPrice));
    });
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    const payload: PricingOverrides = {
      wet: Number(wet),
      general: Number(general),
      postRepair: Number(postRepair),
      balconyFlat: Number(balconyFlat),
      alastauOptionPrice: alastau.trim() === "" ? null : Number(alastau),
    };
    await updateDoc(doc(getFirestoreDb(), "settings", "pricing"), payload).catch(async () => {
      const { setDoc } = await import("firebase/firestore");
      await setDoc(doc(getFirestoreDb(), "settings", "pricing"), payload);
    });
    setMessage("Цены сохранены. Сайт подхватит после обновления кэша (~1 мин).");
  }

  return (
    <section>
      <h2 className="eyebrow">Цены (settings/pricing)</h2>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Пустое поле «Аластау» = уточним. Фолбэк на сайте — `src/lib/pricing.ts`.
      </p>
      <form className="mt-6 grid max-w-lg gap-3 sm:grid-cols-2" onSubmit={(e) => void save(e)}>
        <Field label="Влажная ₸/м²" value={wet} onChange={setWet} />
        <Field label="Генеральная ₸/м²" value={general} onChange={setGeneral} />
        <Field label="После ремонта ₸/м²" value={postRepair} onChange={setPostRepair} />
        <Field label="Балкон стандарт ₸" value={balconyFlat} onChange={setBalconyFlat} />
        <Field label="Аластау (влажная), ₸" value={alastau} onChange={setAlastau} />
        <div className="sm:col-span-2">
          <button type="submit" className="btn btn-primary">
            Сохранить цены
          </button>
          {message ? <p className="mt-3 text-sm text-[var(--color-sage-600)]">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}

function SlotsPanel() {
  const [free, setFree] = useState(String(FALLBACK_SLOT_CAPACITY.free));
  const [total, setTotal] = useState(String(FALLBACK_SLOT_CAPACITY.total));
  const [times, setTimes] = useState(FALLBACK_TIME_SLOTS.join(", "));
  const [dayIso, setDayIso] = useState("");
  const [dayTimes, setDayTimes] = useState(FALLBACK_TIME_SLOTS.join(", "));
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getDoc(doc(getFirestoreDb(), "settings", "slots")).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as {
        free?: number;
        total?: number;
        times?: string[];
      };
      if (data.free != null) setFree(String(data.free));
      if (data.total != null) setTotal(String(data.total));
      if (Array.isArray(data.times)) setTimes(data.times.join(", "));
    });
  }, []);

  return (
    <section className="grid gap-10">
      <div>
        <h2 className="eyebrow">Hero: N из M (settings/slots)</h2>
        <form
          className="mt-4 grid max-w-lg gap-3 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const payload = {
              free: Number(free),
              total: Number(total),
              times: times
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              dayCount: 7,
            };
            const { setDoc } = await import("firebase/firestore");
            await setDoc(doc(getFirestoreDb(), "settings", "slots"), payload, { merge: true });
            setMessage("Слоты Hero сохранены.");
          }}
        >
          <Field label="Свободно" value={free} onChange={setFree} />
          <Field label="Всего" value={total} onChange={setTotal} />
          <div className="sm:col-span-2">
            <Field label="Времена через запятую" value={times} onChange={setTimes} />
          </div>
          <button type="submit" className="btn btn-primary sm:col-span-2">
            Сохранить Hero
          </button>
        </form>
      </div>

      <div>
        <h2 className="eyebrow">День в коллекции slots</h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Документы вида `date`, `times`, `available: true` подставляются в форму брони.
        </p>
        <form
          className="mt-4 grid max-w-lg gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dayIso)) {
              setMessage("Дата в формате YYYY-MM-DD.");
              return;
            }
            await addDoc(collection(getFirestoreDb(), "slots"), {
              date: dayIso,
              times: dayTimes
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              available: true,
            });
            setMessage(`День ${dayIso} добавлен в slots.`);
            setDayIso("");
          }}
        >
          <Field label="Дата YYYY-MM-DD" value={dayIso} onChange={setDayIso} />
          <Field label="Времена" value={dayTimes} onChange={setDayTimes} />
          <button type="submit" className="btn btn-primary">
            Добавить день
          </button>
        </form>
      </div>

      {message ? <p className="text-sm text-[var(--color-sage-600)]">{message}</p> : null}
    </section>
  );
}

function ContentPanel() {
  const [reviews, setReviews] = useState<ContentRow[]>([]);
  const [cases, setCases] = useState<ContentRow[]>([]);
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [quote, setQuote] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseText, setCaseText] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [reviewsSnap, casesSnap] = await Promise.all([
      getDocs(query(collection(getFirestoreDb(), "reviews"), limit(40))),
      getDocs(query(collection(getFirestoreDb(), "cases"), limit(40))),
    ]);
    setReviews(
      reviewsSnap.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          name: String(data.name ?? ""),
          context: String(data.context ?? ""),
          quote: String(data.quote ?? ""),
          published: Boolean(data.published),
        };
      }),
    );
    setCases(
      casesSnap.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          title: String(data.title ?? ""),
          text: String(data.text ?? ""),
          published: Boolean(data.published),
        };
      }),
    );
  }

  useEffect(() => {
    void load().catch(() => setMessage("Не удалось загрузить контент."));
  }, []);

  return (
    <section className="grid gap-10">
      <div>
        <h2 className="eyebrow">Отзывы</h2>
        <form
          className="mt-4 grid max-w-lg gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await addDoc(collection(getFirestoreDb(), "reviews"), {
              name: name.trim(),
              context: context.trim(),
              quote: quote.trim(),
              published: false,
              createdAt: serverTimestamp(),
            });
            setName("");
            setContext("");
            setQuote("");
            setMessage("Отзыв добавлен (черновик).");
            await load();
          }}
        >
          <Field label="Имя" value={name} onChange={setName} />
          <Field label="Контекст" value={context} onChange={setContext} />
          <label className="block text-sm">
            <span className="eyebrow text-[0.58rem]">Цитата</span>
            <textarea
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
              rows={3}
              className="hairline mt-2 w-full rounded-[14px] bg-transparent px-3 py-2.5 outline-none focus:border-[var(--color-sage-600)]"
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Добавить отзыв
          </button>
        </form>
        <ul className="mt-4 grid gap-2">
          {reviews.map((item) => (
            <li key={item.id} className="surface flex items-center justify-between gap-3 p-3 text-sm">
              <span>
                {item.name} — {item.published ? "опубликован" : "черновик"}
              </span>
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={async () => {
                  await updateDoc(doc(getFirestoreDb(), "reviews", item.id), {
                    published: !item.published,
                  });
                  await load();
                }}
              >
                {item.published ? "Снять" : "Опубликовать"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="eyebrow">Кейсы</h2>
        <form
          className="mt-4 grid max-w-lg gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await addDoc(collection(getFirestoreDb(), "cases"), {
              title: caseTitle.trim(),
              text: caseText.trim(),
              published: false,
              createdAt: serverTimestamp(),
            });
            setCaseTitle("");
            setCaseText("");
            setMessage("Кейс добавлен (черновик).");
            await load();
          }}
        >
          <Field label="Заголовок" value={caseTitle} onChange={setCaseTitle} />
          <label className="block text-sm">
            <span className="eyebrow text-[0.58rem]">Текст</span>
            <textarea
              value={caseText}
              onChange={(event) => setCaseText(event.target.value)}
              rows={3}
              className="hairline mt-2 w-full rounded-[14px] bg-transparent px-3 py-2.5 outline-none focus:border-[var(--color-sage-600)]"
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Добавить кейс
          </button>
        </form>
        <ul className="mt-4 grid gap-2">
          {cases.map((item) => (
            <li key={item.id} className="surface flex items-center justify-between gap-3 p-3 text-sm">
              <span>
                {item.title} — {item.published ? "опубликован" : "черновик"}
              </span>
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={async () => {
                  await updateDoc(doc(getFirestoreDb(), "cases", item.id), {
                    published: !item.published,
                  });
                  await load();
                }}
              >
                {item.published ? "Снять" : "Опубликовать"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {message ? <p className="text-sm text-[var(--color-sage-600)]">{message}</p> : null}
    </section>
  );
}
