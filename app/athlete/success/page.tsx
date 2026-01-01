import Link from "next/link";

type Lang = "fa" | "en";

function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

const sportsMap: Record<string, { en: string; fa: string }> = {
  football: { en: "Football", fa: "فوتبال" },
  volleyball: { en: "Volleyball", fa: "والیبال" },
  wrestling: { en: "Wrestling", fa: "کشتی" },
  tennis: { en: "Tennis", fa: "تنیس" },
  padel: { en: "Padel", fa: "پدل" },
};

export default function ApplySuccess({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  const name = (Array.isArray(searchParams.name) ? searchParams.name[0] : searchParams.name) || "";
  const sportKey = (Array.isArray(searchParams.sport) ? searchParams.sport[0] : searchParams.sport) || "football";
  const city = (Array.isArray(searchParams.city) ? searchParams.city[0] : searchParams.city) || "";
  const goal = (Array.isArray(searchParams.goal) ? searchParams.goal[0] : searchParams.goal) || "";

  const sport = sportsMap[sportKey] ? (isFa ? sportsMap[sportKey].fa : sportsMap[sportKey].en) : sportKey;

  const t = {
    en: {
      title: "Application submitted ✅",
      subtitle:
        "We received your request. Next step is verification (coach/federation/video). After that, you can be listed for investment.",
      details: "Submitted details",
      backHome: "Back to Home",
      applyAgain: "Submit another application",
      note: "MVP note: Data is not saved yet (Phase 1).",
      fields: { name: "Name", sport: "Sport", city: "City", goal: "Goal" },
    },
    fa: {
      title: "درخواست ثبت شد ✅",
      subtitle:
        "درخواست شما دریافت شد. مرحله بعد اعتبارسنجی (مربی/فدراسیون/ویدیو) است. سپس می‌توانید برای سرمایه‌گذاری لیست شوید.",
      details: "جزئیات ارسال‌شده",
      backHome: "بازگشت به خانه",
      applyAgain: "ارسال درخواست جدید",
      note: "نکته MVP: اطلاعات فعلاً ذخیره نمی‌شود (فاز ۱).",
      fields: { name: "نام", sport: "رشته", city: "شهر", goal: "هدف" },
    },
  }[lang];

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href={`/?lang=${lang}`} className="text-xl font-extrabold tracking-wide">
          TALIVA
        </Link>

        <div className="ml-2 rounded-full bg-white/10 px-3 py-1">
          <Link className={lang === "fa" ? "font-bold text-white" : ""} href={`/athlete/apply/success?lang=fa`}>
            FA
          </Link>
          <span className="px-2 opacity-60">|</span>
          <Link className={lang === "en" ? "font-bold text-white" : ""} href={`/athlete/apply/success?lang=en`}>
            EN
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>
        <p className="mt-3 text-white/70">{t.subtitle}</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-bold">{t.details}</div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">{t.fields.name}</div>
              <div className="mt-1 font-bold">{name || "-"}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">{t.fields.sport}</div>
              <div className="mt-1 font-bold">{sport || "-"}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">{t.fields.city}</div>
              <div className="mt-1 font-bold">{city || "-"}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/60">{t.fields.goal}</div>
              <div className="mt-1 font-bold">{goal ? `${goal} USDC` : "-"}</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/55">{t.note}</div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <Link
              href={`/?lang=${lang}`}
              className="rounded-xl bg-[#50FF9D] px-6 py-3 text-center text-sm font-semibold text-black hover:brightness-95"
            >
              {t.backHome}
            </Link>

            <Link
              href={`/athlete/apply?lang=${lang}`}
              className="rounded-xl border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              {t.applyAgain}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}