import Link from "next/link";

type Lang = "fa" | "en";

function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

/* ---------- Featured Athletes ---------- */
function FeaturedAthletes({ lang }: { lang: Lang }) {
  const isFa = lang === "fa";

  const athletes = [
    { id: "a1", name: isFa ? "نمونه ورزشکار ۱" : "Sample Athlete 1", sport: "Football", city: isFa ? "تهران" : "Tehran", score: 84, funded: 62, raised: 3100, target: 5000 },
    { id: "a2", name: isFa ? "نمونه ورزشکار ۲" : "Sample Athlete 2", sport: "Wrestling", city: isFa ? "مشهد" : "Mashhad", score: 78, funded: 41, raised: 2050, target: 5000 },
    { id: "a3", name: isFa ? "نمونه ورزشکار ۳" : "Sample Athlete 3", sport: "Volleyball", city: isFa ? "شیراز" : "Shiraz", score: 81, funded: 55, raised: 2750, target: 5000 },
    { id: "a4", name: isFa ? "نمونه ورزشکار ۴" : "Sample Athlete 4", sport: "Tennis", city: isFa ? "اصفهان" : "Isfahan", score: 73, funded: 28, raised: 1400, target: 5000 },
  ];

  const tabs = [
    { key: "All", label: isFa ? "همه" : "All" },
    { key: "Football", label: isFa ? "فوتبال" : "Football" },
    { key: "Volleyball", label: isFa ? "والیبال" : "Volleyball" },
    { key: "Wrestling", label: isFa ? "کشتی" : "Wrestling" },
    { key: "Tennis", label: isFa ? "تنیس" : "Tennis" },
    { key: "Padel", label: isFa ? "پدل" : "Padel" },
  ];

  return (
    <section className={isFa ? "direction-rtl" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">
              {isFa ? "استعدادهای منتخب" : "Featured Athletes"}
            </h2>
            <p className="mt-2 text-sm text-white/65">
              {isFa
                ? "ورزشکارها را ببین، پیشرفت جذب سرمایه را بررسی کن و وارد مسیر حمایت شو."
                : "Explore athletes, track funding progress, and invest with confidence."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {athletes.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-bold">{a.name}</div>
                  <div className="mt-1 text-xs text-white/65">
                    {a.sport} • {a.city}
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
                  <div className="text-[10px] text-white/65">Score</div>
                  <div className="text-xl font-extrabold">{a.score}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>{isFa ? "پیشرفت جذب سرمایه" : "Funding Progress"}</span>
                  <span>{a.funded}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#50FF9D]" style={{ width: `${a.funded}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-white/60">
                  {a.raised.toLocaleString()} / {a.target.toLocaleString()} USDC
                </div>
              </div>

              <Link
                href={`/athlete/${a.id}?lang=${lang}`}
                className="mt-4 block w-full rounded-xl bg-[#50FF9D] px-4 py-2 text-center text-sm font-semibold text-black hover:brightness-95"
              >
                {isFa ? "مشاهده پروفایل" : "View Profile"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks({ lang }: { lang: Lang }) {
  const isFa = lang === "fa";

  const items = [
    {
      n: "01",
      icon: "🧠",
      titleEn: "Discover Talent",
      descEn: "Athletes upload videos. AI & coaches evaluate real potential.",
      titleFa: "کشف استعداد",
      descFa: "ورزشکار ویدیو ارسال می‌کند. هوش مصنوعی و مربی‌ها استعداد را ارزیابی می‌کنند.",
      badgeEn: "AI Powered",
      badgeFa: "هوشمند",
    },
    {
      n: "02",
      icon: "🪙",
      titleEn: "Invest Securely",
      descEn: "Athletes are tokenized as NFTs. Funds go to smart escrow contracts.",
      titleFa: "سرمایه‌گذاری امن",
      descFa: "ورزشکار به‌صورت NFT عرضه می‌شود. پول داخل قرارداد امانی هوشمند نگه‌داری می‌شود.",
      badgeEn: "Escrow",
      badgeFa: "امانی",
    },
    {
      n: "03",
      icon: "🚀",
      titleEn: "Grow by Milestones",
      descEn: "Funds release step-by-step based on tiers (league level), not only national teams.",
      titleFa: "رشد مرحله‌ای (Tier)",
      descFa: "پول مرحله‌ای آزاد می‌شود بر اساس سطح رقابتی/لیگ‌ها (Tier)، نه فقط تیم ملی.",
      badgeEn: "Tier Based",
      badgeFa: "سطح‌بندی",
    },
  ];

  return (
    <section className={isFa ? "direction-rtl" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            {isFa ? "TALIVA چگونه کار می‌کند؟" : "How TALIVA Works"}
          </h2>
          <p className="text-sm text-white/65">
            {isFa
              ? "یک مسیر ساده و شفاف؛ از کشف استعداد تا رشد واقعی."
              : "A simple and transparent path from talent to growth."}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.n}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="absolute right-4 top-4 text-5xl font-extrabold text-white/5">
                {it.n}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#50FF9D] text-xl">
                  <span className="text-black">{it.icon}</span>
                </div>
                <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                  {isFa ? it.badgeFa : it.badgeEn}
                </div>
              </div>

              <div className="mt-4 text-lg font-extrabold">
                {isFa ? it.titleFa : it.titleEn}
              </div>
              <p className="mt-2 text-sm text-white/70">
                {isFa ? it.descFa : it.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA({ lang }: { lang: Lang }) {
  const isFa = lang === "fa";
  return (
    <section className={isFa ? "direction-rtl" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <h3 className="text-2xl font-extrabold md:text-3xl">
            {isFa ? "هر استعداد، شایسته یک فرصت واقعی است" : "Every Talent Deserves a Real Chance"}
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            {isFa
              ? "به TALIVA بپیوند و بخشی از آینده ورزش باش."
              : "Join TALIVA and be part of the future of sports."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-xl bg-[#50FF9D] px-6 py-3 font-semibold text-black hover:brightness-95">
              {isFa ? "ثبت‌نام ورزشکار" : "Join as Athlete"}
            </button>
            <button className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">
              {isFa ? "سرمایه‌گذار شو" : "Become an Investor"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer({ lang }: { lang: Lang }) {
  const isFa = lang === "fa";
  return (
    <footer className={isFa ? "direction-rtl" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="text-xl font-extrabold">TALIVA</div>
            <p className="mt-3 text-sm text-white/65">
              {isFa ? "فرصت واقعی برای استعدادهای واقعی" : "Where Talent Gets a Real Chance"}
            </p>
          </div>

          <div className="text-sm">
            <div className="font-bold text-white/85">{isFa ? "لینک‌ها" : "Links"}</div>
            <div className="mt-3 grid gap-2 text-white/70">
              <a className="hover:text-white" href="#">{isFa ? "درباره ما" : "About"}</a>
              <a className="hover:text-white" href="#">{isFa ? "ورزشکاران" : "Athletes"}</a>
              <a className="hover:text-white" href="#">{isFa ? "سرمایه‌گذاری" : "Invest"}</a>
              <a className="hover:text-white" href="#">{isFa ? "توکن (به‌زودی)" : "Token (Coming Soon)"}</a>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-bold text-white/85">{isFa ? "شبکه‌های اجتماعی" : "Social"}</div>
            <div className="mt-3 grid gap-2 text-white/70">
              <a className="hover:text-white" href="#">X (Twitter)</a>
              <a className="hover:text-white" href="#">Instagram</a>
              <a className="hover:text-white" href="#">Telegram</a>
              <a className="hover:text-white" href="#">Discord</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/55">
          © {new Date().getFullYear()} TALIVA. {isFa ? "تمام حقوق محفوظ است." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}

/* ---------- Home ---------- */
export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  const t = {
    en: {
      brand: "TALIVA",
      h1: "Where Talent Gets a Real Chance",
      p1: "Discover athletes. Invest securely. Help talent rise with milestone-based escrow funding.",
      primary: "Join as Athlete",
      secondary: "Invest in Athletes",
      badge1: "Smart Contract Escrow",
      badge2: "AI Evaluation",
      badge3: "NFT Investment",
      badge4: "Equal Opportunity",
      navHome: "Home",
      navAthlete: "Athlete",
      navInvestor: "Investor",
    },
    fa: {
      brand: "تالـیوا",
      h1: "فرصت واقعی برای استعدادهای واقعی",
      p1: "کشف استعداد، سرمایه‌گذاری امن و حمایت مالی مرحله‌ای با قرارداد امانی.",
      primary: "ثبت‌نام ورزشکار",
      secondary: "سرمایه‌گذاری روی ورزشکاران",
      badge1: "قرارداد هوشمند امانی",
      badge2: "ارزیابی هوشمند",
      badge3: "سرمایه‌گذاری NFT",
      badge4: "فرصت برابر",
      navHome: "خانه",
      navAthlete: "ورزشکار",
      navInvestor: "سرمایه‌گذار",
    },
  }[lang];

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-extrabold tracking-wide">{t.brand}</div>

        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link className="hover:text-white" href={`/?lang=${lang}`}>
            {t.navHome}
          </Link>
          <Link className="hover:text-white" href={`/athlete/123?lang=${lang}`}>
            {t.navAthlete}
          </Link>
          <Link className="hover:text-white" href={`/investor/dashboard?lang=${lang}`}>
            {t.navInvestor}
          </Link>

          <div className="ml-2 rounded-full bg-white/10 px-3 py-1">
            <Link className={lang === "fa" ? "font-bold text-white" : ""} href="/?lang=fa">
              FA
            </Link>
            <span className="px-2 opacity-60">|</span>
            <Link className={lang === "en" ? "font-bold text-white" : ""} href="/?lang=en">
              EN
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:py-16">
        {/* Left */}
        <div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{t.h1}</h1>
          <p className="mt-5 max-w-xl text-base text-white/70 md:text-lg">{t.p1}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-xl bg-[#50FF9D] px-6 py-3 font-semibold text-black hover:brightness-95">
              {t.primary}
            </button>
            <button className="rounded-xl border border-white/25 px-6 py-3 font-semibold text-white hover:bg-white/10">
              {t.secondary}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/85">
              🔒 {t.badge1}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/85">
              🤖 {t.badge2}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/85">
              🪙 {t.badge3}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/85">
              🌍 {t.badge4}
            </span>
          </div>
        </div>

        {/* Right Visual (placeholder) */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,#50FF9D,transparent_45%),radial-gradient(circle_at_70%_60%,#1A8FFF,transparent_50%)]" />
          <div className="relative">
            <div className="text-sm font-semibold text-white/80">
              {lang === "fa" ? "ورزشکار منتخب" : "Featured Athlete"}
            </div>

            <div className="mt-3 rounded-2xl bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{lang === "fa" ? "نمونه ورزشکار" : "Sample Athlete"}</div>
                  <div className="mt-1 text-sm text-white/65">
                    {lang === "fa" ? "فوتبال • تهران" : "Football • Tehran"}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                  <div className="text-xs text-white/70">TALIVA Score</div>
                  <div className="text-2xl font-extrabold">84</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>{lang === "fa" ? "پیشرفت جذب سرمایه" : "Funding Progress"}</span>
                  <span>62%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[62%] rounded-full bg-[#50FF9D]" />
                </div>
                <div className="mt-2 text-xs text-white/60">3,100 / 5,000 USDC</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-white/55">
              {lang === "fa"
                ? "فعلاً تصویر/ویدیو نمونه است. بعداً ویدیوهای واقعی جایگزین می‌شود."
                : "Placeholder visual. We'll plug real athlete media later."}
            </div>
          </div>
        </div>
      </section>

      <FeaturedAthletes lang={lang} />
      <HowItWorks lang={lang} />
      <FinalCTA lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}