import Link from "next/link";

type Lang = "fa" | "en";

function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

function formatMoney(n: number) {
  return n.toLocaleString();
}

function TierBadge({ tier }: { tier: "D" | "C" | "B" | "A" }) {
  const map: Record<string, string> = {
    D: "bg-white/10 border-white/10",
    C: "bg-white/10 border-white/10",
    B: "bg-white/10 border-white/10",
    A: "bg-white/10 border-white/10",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${map[tier]}`}>
      <span className="h-2 w-2 rounded-full bg-[#50FF9D]" />
      Tier {tier}
    </span>
  );
}

function Tabs({
  lang,
  active,
  setActive,
}: {
  lang: Lang;
  active: string;
  setActive: (v: string) => void;
}) {
  const isFa = lang === "fa";
  const tabs = [
    { key: "overview", label: isFa ? "نمای کلی" : "Overview" },
    { key: "videos", label: isFa ? "ویدیوها" : "Videos" },
    { key: "milestones", label: isFa ? "مراحل (Tier)" : "Milestones" },
    { key: "nft", label: isFa ? "NFT و سرمایه‌گذاری" : "NFT & Investment" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const on = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={
              on
                ? "rounded-full bg-[#50FF9D] px-4 py-2 text-xs font-bold text-black"
                : "rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------ Client Wrapper for tabs (simple) ------------------ */
function ClientTabs({
  lang,
  childrenByKey,
}: {
  lang: Lang;
  childrenByKey: Record<string, React.ReactNode>;
}) {
  // tiny client-like behavior بدون فایل جدا: Next Server Component اینجا مشکل میده اگر state بخوایم
  // برای MVP ساده: تب‌ها رو لینک‌دار می‌کنیم (بدون useState)
  const isFa = lang === "fa";
  const tabs = [
    { key: "overview", label: isFa ? "نمای کلی" : "Overview" },
    { key: "videos", label: isFa ? "ویدیوها" : "Videos" },
    { key: "milestones", label: isFa ? "مراحل (Tier)" : "Milestones" },
    { key: "nft", label: isFa ? "NFT و سرمایه‌گذاری" : "NFT & Investment" },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`#${t.key}`}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-10">
        {tabs.map((t) => (
          <section key={t.key} id={t.key} className="scroll-mt-24">
            {childrenByKey[t.key]}
          </section>
        ))}
      </div>
    </div>
  );
}

export default function AthleteProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  // Mock athlete by id (بعداً از DB میاد)
  const athlete = {
    id: params.id,
    name: isFa ? "نمونه ورزشکار" : "Sample Athlete",
    sport: isFa ? "فوتبال" : "Football",
    city: isFa ? "تهران" : "Tehran",
    age: 19,
    verified: true,
    score: 84,
    funding: { raised: 3100, target: 5000 },
    tierCurrent: "C" as const,
    story: isFa
      ? "من از محله‌ای شروع کردم که امکانات کم بود. هدفم اینه با تمرین درست و حمایت مالی، مسیر حرفه‌ای رو سریع‌تر طی کنم."
      : "I started with limited resources. My goal is to accelerate my pro journey with structured training and milestone funding.",
    goals: isFa
      ? ["تمرین با مربی حرفه‌ای", "شرکت در لیگ سطح بالاتر", "سفر و هزینه مسابقات"]
      : ["Work with a pro coach", "Compete in higher-level leagues", "Covers travel & tournament costs"],
    videos: [
      { title: isFa ? "هایلایت بازی ۱" : "Match Highlights 1", tag: isFa ? "سرعت • تکنیک" : "Speed • Technique" },
      { title: isFa ? "تمرین دریبل" : "Dribbling Session", tag: isFa ? "کنترل توپ" : "Ball Control" },
      { title: isFa ? "شوت‌زنی" : "Shooting", tag: isFa ? "دقت" : "Accuracy" },
    ],
    milestones: [
      { tier: "D" as const, titleFa: "Development / منطقه‌ای", titleEn: "Development / Regional", percent: 10, status: "released" as const },
      { tier: "C" as const, titleFa: "لیگ کشوری (نیمه‌حرفه‌ای)", titleEn: "National (Semi-Pro)", percent: 15, status: "pending" as const },
      { tier: "B" as const, titleFa: "لیگ حرفه‌ای سطح بالا", titleEn: "High Pro League", percent: 25, status: "locked" as const },
      { tier: "A" as const, titleFa: "بین‌المللی / تیم ملی", titleEn: "International / National Team", percent: 40, status: "locked" as const },
    ],
    nft: {
      price: 50,
      totalSupply: 100,
      sold: 62,
      rightsFa: ["مشاهده پیشرفت", "دسترسی به گزارش‌ها", "رأی‌دهی (فاز ۲)"],
      rightsEn: ["Track progress", "Access reports", "Governance voting (Phase 2)"],
    },
  };

  const fundedPct = Math.round((athlete.funding.raised / athlete.funding.target) * 100);

  const statusLabel = (s: "released" | "pending" | "locked") => {
    if (lang === "fa") {
      if (s === "released") return "آزاد شد ✅";
      if (s === "pending") return "در انتظار تأیید ⏳";
      return "قفل 🔒";
    } else {
      if (s === "released") return "Released ✅";
      if (s === "pending") return "Pending ⏳";
      return "Locked 🔒";
    }
  };

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      {/* Top Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href={`/?lang=${lang}`} className="text-xl font-extrabold tracking-wide">
          TALIVA
        </Link>

        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link className="hover:text-white" href={`/?lang=${lang}`}>
            {isFa ? "خانه" : "Home"}
          </Link>
          <Link className="hover:text-white" href={`/investor/dashboard?lang=${lang}`}>
            {isFa ? "داشبورد سرمایه‌گذار" : "Investor"}
          </Link>

          <div className="ml-2 rounded-full bg-white/10 px-3 py-1">
            <Link className={lang === "fa" ? "font-bold text-white" : ""} href={`/athlete/${params.id}?lang=fa`}>
              FA
            </Link>
            <span className="px-2 opacity-60">|</span>
            <Link className={lang === "en" ? "font-bold text-white" : ""} href={`/athlete/${params.id}?lang=en`}>
              EN
            </Link>
          </div>
        </nav>
      </header>

      {/* Profile Header */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Media */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 md:col-span-1">
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,#50FF9D,transparent_45%),radial-gradient(circle_at_70%_60%,#1A8FFF,transparent_50%)]" />
            <div className="relative">
              <div className="text-sm font-semibold text-white/80">
                {isFa ? "ویدیو/تصویر" : "Media"}
              </div>
              <div className="mt-3 rounded-2xl bg-black/25 p-5">
                <div className="text-sm text-white/70">
                  {isFa ? "فعلاً نمونه است (بعداً ویدیوها جایگزین می‌شوند)" : "Placeholder (we’ll plug real videos later)"}
                </div>
                <div className="mt-4 h-40 w-full rounded-xl bg-white/10" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold md:text-4xl">{athlete.name}</h1>
                  {athlete.verified && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
                      {isFa ? "تأیید شده" : "Verified"}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/65">
                  {athlete.sport} • {athlete.city} • {isFa ? `سن ${athlete.age}` : `Age ${athlete.age}`}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <TierBadge tier={athlete.tierCurrent} />
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
                    {isFa ? "پرداخت مرحله‌ای (Escrow)" : "Milestone Escrow"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">
                    {isFa ? "تحلیل هوشمند" : "AI Analyzed"}
                  </span>
                </div>
              </div>

              {/* Score + Funding */}
              <div className="w-full md:w-[360px]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/70">TALIVA Score</div>
                    <div className="text-3xl font-extrabold">{athlete.score}</div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>{isFa ? "پیشرفت جذب سرمایه" : "Funding Progress"}</span>
                      <span>{fundedPct}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-[#50FF9D]" style={{ width: `${fundedPct}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-white/60">
                      {formatMoney(athlete.funding.raised)} / {formatMoney(athlete.funding.target)} USDC
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="w-full rounded-xl bg-[#50FF9D] px-4 py-3 text-sm font-semibold text-black hover:brightness-95">
                        {isFa ? "سرمایه‌گذاری" : "Invest Now"}
                      </button>
                      <button className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
                        {isFa ? "مشاهده NFT" : "View NFT"}
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] text-white/55">
                      {isFa
                        ? "حمایت مالی مرحله‌ای بر اساس سطح رقابتی/لیگ‌ها (Tier) انجام می‌شود، نه صرفاً تیم ملی."
                        : "Milestone releases are tier-based (league level), not only national teams."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs (anchor-based) */}
            <div className="mt-8">
              <ClientTabs
                lang={lang}
                childrenByKey={{
                  overview: (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                      <h2 className="text-xl font-extrabold">{isFa ? "داستان" : "Story"}</h2>
                      <p className="mt-3 text-sm text-white/70">{athlete.story}</p>

                      <h3 className="mt-6 text-sm font-bold text-white/85">{isFa ? "هدف هزینه‌ها" : "Funding Goals"}</h3>
                      <ul className="mt-3 grid gap-2 text-sm text-white/70">
                        {athlete.goals.map((g, idx) => (
                          <li key={idx} className="rounded-2xl bg-black/20 px-4 py-3">
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),

                  videos: (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-extrabold">{isFa ? "ویدیوها" : "Videos"}</h2>
                          <p className="mt-2 text-sm text-white/65">
                            {isFa ? "برچسب‌گذاری و تحلیل اولیه (MVP)" : "Basic tagging & analysis (MVP)"}
                          </p>
                        </div>
                        <button className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
                          {isFa ? "آپلود ویدیو" : "Upload Video"}
                        </button>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {athlete.videos.map((v, i) => (
                          <div key={i} className="rounded-2xl bg-black/20 p-4">
                            <div className="h-28 w-full rounded-xl bg-white/10" />
                            <div className="mt-3 font-bold">{v.title}</div>
                            <div className="mt-1 text-xs text-white/60">{v.tag}</div>
                            <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/80">
                              {isFa ? "AI Analyzed" : "AI Analyzed"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),

                  milestones: (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                      <h2 className="text-xl font-extrabold">{isFa ? "مراحل آزادسازی پول (Tier)" : "Milestone Releases (Tier)"}</h2>
                      <p className="mt-2 text-sm text-white/65">
                        {isFa
                          ? "آزادسازی سرمایه بر اساس سطح لیگ/رقابت انجام می‌شود. همه الزاماً تیم ملی نمی‌روند."
                          : "Releases are based on competitive level tiers. Not everyone must reach national teams."}
                      </p>

                      <div className="mt-6 space-y-3">
                        {athlete.milestones.map((m, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <TierBadge tier={m.tier} />
                              <div className="font-bold">
                                {isFa ? m.titleFa : m.titleEn}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 text-sm md:justify-end">
                              <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                                {m.percent}% {isFa ? "آزادسازی" : "Release"}
                              </div>
                              <div className="text-xs text-white/70">{statusLabel(m.status)}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                        <div className="font-bold text-white/85">{isFa ? "شفافیت" : "Transparency"}</div>
                        <ul className="mt-2 grid gap-2 text-sm">
                          <li>{isFa ? "تأیید Tier توسط کمیته (MVP)" : "Tier approval by committee (MVP)"}</li>
                          <li>{isFa ? "ثبت مدرک روی IPFS (بعداً)" : "Evidence stored on IPFS (later)"}</li>
                          <li>{isFa ? "پرداخت از Escrow به‌صورت مرحله‌ای" : "Escrow releases funds step-by-step"}</li>
                        </ul>
                      </div>
                    </div>
                  ),

                  nft: (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                      <h2 className="text-xl font-extrabold">{isFa ? "NFT و سرمایه‌گذاری" : "NFT & Investment"}</h2>
                      <p className="mt-2 text-sm text-white/65">
                        {isFa
                          ? "در MVP اطلاعات نمایش داده می‌شود. فاز بعد تراکنش واقعی و اتصال کیف پول اضافه می‌شود."
                          : "MVP shows the structure. Phase 2 adds wallet + real transactions."}
                      </p>

                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-black/20 p-4">
                          <div className="text-xs text-white/60">{isFa ? "قیمت هر NFT" : "NFT Price"}</div>
                          <div className="mt-1 text-2xl font-extrabold">{athlete.nft.price} USDC</div>
                        </div>
                        <div className="rounded-2xl bg-black/20 p-4">
                          <div className="text-xs text-white/60">{isFa ? "کل عرضه" : "Total Supply"}</div>
                          <div className="mt-1 text-2xl font-extrabold">{athlete.nft.totalSupply}</div>
                        </div>
                        <div className="rounded-2xl bg-black/20 p-4">
                          <div className="text-xs text-white/60">{isFa ? "فروخته‌شده" : "Sold"}</div>
                          <div className="mt-1 text-2xl font-extrabold">{athlete.nft.sold}%</div>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="font-bold">{isFa ? "حقوق هولدرها (فاز ۲)" : "Holder Rights (Phase 2)"}</div>
                        <ul className="mt-3 grid gap-2 text-sm text-white/70">
                          {(isFa ? athlete.nft.rightsFa : athlete.nft.rightsEn).map((r, i) => (
                            <li key={i} className="rounded-xl bg-white/5 px-4 py-3">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-16" />
    </main>
  );
}