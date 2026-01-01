import Link from "next/link";

type Lang = "fa" | "en";

function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

function money(n: number) {
  return n.toLocaleString();
}

export default function InvestorBrowseAthletes({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  const t = {
    en: {
      title: "Browse Athletes",
      subtitle: "Filter by sport and view funding + tier indicators.",
      home: "Home",
      dash: "Dashboard",
      filters: "Filters",
      sport: "Sport",
      all: "All",
      sort: "Sort",
      sort1: "Highest Score",
      sort2: "Most Funded",
      sort3: "Newest",
      view: "View Profile",
      funded: "Funded",
      tier: "Tier",
      score: "Score",
      goal: "Goal",
      raised: "Raised",
    },
    fa: {
      title: "مشاهده ورزشکاران",
      subtitle: "فیلتر بر اساس رشته و مشاهده وضعیت جذب سرمایه + Tier.",
      home: "خانه",
      dash: "داشبورد",
      filters: "فیلترها",
      sport: "رشته",
      all: "همه",
      sort: "مرتب‌سازی",
      sort1: "بیشترین امتیاز",
      sort2: "بیشترین جذب سرمایه",
      sort3: "جدیدترین",
      view: "مشاهده پروفایل",
      funded: "جذب شده",
      tier: "Tier",
      score: "امتیاز",
      goal: "هدف",
      raised: "جمع‌شده",
    },
  }[lang];

  const athletes = [
    { id: "a1", nameFa: "نمونه ورزشکار ۱", nameEn: "Sample Athlete 1", sportKey: "football", sportFa: "فوتبال", sportEn: "Football", tier: "C", score: 84, raised: 3100, goal: 5000 },
    { id: "a2", nameFa: "نمونه ورزشکار ۲", nameEn: "Sample Athlete 2", sportKey: "wrestling", sportFa: "کشتی", sportEn: "Wrestling", tier: "D", score: 78, raised: 2050, goal: 5000 },
    { id: "a3", nameFa: "نمونه ورزشکار ۳", nameEn: "Sample Athlete 3", sportKey: "volleyball", sportFa: "والیبال", sportEn: "Volleyball", tier: "C", score: 81, raised: 2750, goal: 5000 },
    { id: "a4", nameFa: "نمونه ورزشکار ۴", nameEn: "Sample Athlete 4", sportKey: "tennis", sportFa: "تنیس", sportEn: "Tennis", tier: "B", score: 73, raised: 1400, goal: 5000 },
    { id: "a5", nameFa: "نمونه ورزشکار ۵", nameEn: "Sample Athlete 5", sportKey: "padel", sportFa: "پدل", sportEn: "Padel", tier: "D", score: 76, raised: 900, goal: 4000 },
  ].map((a) => ({ ...a, fundedPct: Math.round((a.raised / a.goal) * 100) }));

  const sport = (Array.isArray(searchParams.sport) ? searchParams.sport[0] : searchParams.sport) || "all";
  const sort = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) || "score";

  const filtered = athletes
    .filter((a) => (sport === "all" ? true : a.sportKey === sport))
    .sort((a, b) => {
      if (sort === "funded") return b.fundedPct - a.fundedPct;
      if (sort === "new") return b.id.localeCompare(a.id);
      return b.score - a.score;
    });

  const sports = [
    { key: "all", label: t.all },
    { key: "football", label: isFa ? "فوتبال" : "Football" },
    { key: "volleyball", label: isFa ? "والیبال" : "Volleyball" },
    { key: "wrestling", label: isFa ? "کشتی" : "Wrestling" },
    { key: "tennis", label: isFa ? "تنیس" : "Tennis" },
    { key: "padel", label: isFa ? "پدل" : "Padel" },
  ];

  const sorts = [
    { key: "score", label: t.sort1 },
    { key: "funded", label: t.sort2 },
    { key: "new", label: t.sort3 },
  ];

  const makeHref = (nextSport: string, nextSort: string) => {
    const q = new URLSearchParams({ lang, sport: nextSport, sort: nextSort }).toString();
    return `/investor/athletes?${q}`;
  };

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>
            <p className="mt-2 text-white/70">{t.subtitle}</p>
          </div>

          <div className="rounded-full bg-white/10 px-3 py-1 text-sm">
            <Link className={lang === "fa" ? "font-bold text-white" : "text-white/70"} href="/investor/athletes?lang=fa">
              FA
            </Link>
            <span className="px-2 opacity-60">|</span>
            <Link className={lang === "en" ? "font-bold text-white" : "text-white/70"} href="/investor/athletes?lang=en">
              EN
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:col-span-1">
            <div className="text-sm font-bold">{t.filters}</div>

            <div className="mt-4">
              <div className="text-xs text-white/60">{t.sport}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sports.map((s) => {
                  const active = sport === s.key;
                  return (
                    <Link
                      key={s.key}
                      href={makeHref(s.key, sort)}
                      className={
                        active
                          ? "rounded-full bg-[#50FF9D] px-4 py-2 text-xs font-bold text-black"
                          : "rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                      }
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-white/60">{t.sort}</div>
              <div className="mt-2 grid gap-2">
                {sorts.map((s) => {
                  const active = sort === s.key;
                  return (
                    <Link
                      key={s.key}
                      href={makeHref(sport, s.key)}
                      className={
                        active
                          ? "rounded-xl bg-[#50FF9D] px-4 py-2 text-sm font-bold text-black"
                          : "rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                      }
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <div key={a.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-bold">{isFa ? a.nameFa : a.nameEn}</div>
                      <div className="mt-1 text-xs text-white/60">{isFa ? a.sportFa : a.sportEn}</div>
                    </div>

                    <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
                      <div className="text-[10px] text-white/60">{t.score}</div>
                      <div className="text-xl font-extrabold">{a.score}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                      {t.tier}: {a.tier}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                      {t.funded}: {a.fundedPct}%
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>
                        {t.raised}: {money(a.raised)}
                      </span>
                      <span>
                        {t.goal}: {money(a.goal)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-[#50FF9D]" style={{ width: `${a.fundedPct}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/athlete/${a.id}?lang=${lang}`}
                    className="mt-4 block w-full rounded-xl bg-[#50FF9D] px-4 py-2 text-center text-sm font-semibold text-black hover:brightness-95"
                  >
                    {t.view}
                  </Link>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                {isFa ? "هیچ ورزشکاری مطابق فیلتر پیدا نشد." : "No athletes found for this filter."}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}