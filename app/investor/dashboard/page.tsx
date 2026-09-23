import Link from "next/link";
import { getLang, type SearchParams } from "@/app/lib/i18n";

function money(n: number) {
  return n.toLocaleString();
}

function TierPill({ tier }: { tier: "D" | "C" | "B" | "A" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85">
      <span className="h-2 w-2 rounded-full bg-[#50FF9D]" />
      Tier {tier}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

export default async function InvestorDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const lang = getLang(await searchParams);
  const isFa = lang === "fa";

  const t = {
    en: {
      title: "Investor Dashboard",
      portfolio: "Portfolio",
      activity: "Activity",
      nfts: "NFT Holdings",
      totalInvested: "Total Invested",
      activeAthletes: "Active Athletes",
      releasedFunds: "Released Funds",
      avgProgress: "Avg. Progress",
      viewProfile: "View Profile",
      invested: "Invested",
      progress: "Progress",
      escrow: "Escrow",
      released: "Released",
      pending: "Pending",
      locked: "Locked",
      comingSoon: "Coming Soon",
      tokenTeaser: "TALIVA Token (TLV)",
      tokenDesc: "Voting, rewards, and fee discounts will activate in Phase 2.",
    },
    fa: {
      title: "داشبورد سرمایه‌گذار",
      portfolio: "پورتفولیو",
      activity: "فعالیت‌ها",
      nfts: "دارایی‌های NFT",
      totalInvested: "کل سرمایه‌گذاری",
      activeAthletes: "ورزشکاران فعال",
      releasedFunds: "مبالغ آزادشده",
      avgProgress: "میانگین پیشرفت",
      viewProfile: "مشاهده پروفایل",
      invested: "سرمایه‌گذاری",
      progress: "پیشرفت",
      escrow: "امانی",
      released: "آزاد شد",
      pending: "در انتظار",
      locked: "قفل",
      comingSoon: "به‌زودی",
      tokenTeaser: "توکن TALIVA (TLV)",
      tokenDesc: "رأی‌دهی، پاداش و تخفیف کارمزد در فاز ۲ فعال می‌شود.",
    },
  }[lang];

  const portfolio = [
    {
      athleteId: "a1",
      name: isFa ? "نمونه ورزشکار ۱" : "Sample Athlete 1",
      sport: isFa ? "فوتبال" : "Football",
      invested: 500,
      tier: "C" as const,
      progress: 62,
      raised: 3100,
      target: 5000,
      escrow: [
        { tier: "D" as const, pct: 10, status: "released" as const },
        { tier: "C" as const, pct: 15, status: "pending" as const },
        { tier: "B" as const, pct: 25, status: "locked" as const },
        { tier: "A" as const, pct: 40, status: "locked" as const },
      ],
    },
    {
      athleteId: "a2",
      name: isFa ? "نمونه ورزشکار ۲" : "Sample Athlete 2",
      sport: isFa ? "کشتی" : "Wrestling",
      invested: 300,
      tier: "D" as const,
      progress: 41,
      raised: 2050,
      target: 5000,
      escrow: [
        { tier: "D" as const, pct: 10, status: "pending" as const },
        { tier: "C" as const, pct: 15, status: "locked" as const },
        { tier: "B" as const, pct: 25, status: "locked" as const },
        { tier: "A" as const, pct: 40, status: "locked" as const },
      ],
    },
    {
      athleteId: "a3",
      name: isFa ? "نمونه ورزشکار ۳" : "Sample Athlete 3",
      sport: isFa ? "والیبال" : "Volleyball",
      invested: 250,
      tier: "C" as const,
      progress: 55,
      raised: 2750,
      target: 5000,
      escrow: [
        { tier: "D" as const, pct: 10, status: "released" as const },
        { tier: "C" as const, pct: 15, status: "released" as const },
        { tier: "B" as const, pct: 25, status: "pending" as const },
        { tier: "A" as const, pct: 40, status: "locked" as const },
      ],
    },
  ];

  const totalInvestedNum = portfolio.reduce((s, p) => s + p.invested, 0);
  const releasedFundsNum = 3200;
  const avgProgressNum = Math.round(portfolio.reduce((s, p) => s + p.progress, 0) / portfolio.length);

  const statusLabel = (s: "released" | "pending" | "locked") => {
    if (s === "released") return `${t.released} ✅`;
    if (s === "pending") return `${t.pending} ⏳`;
    return `${t.locked} 🔒`;
  };

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label={t.totalInvested} value={`${money(totalInvestedNum)} USDC`} />
          <StatCard label={t.activeAthletes} value={`${portfolio.length}`} />
          <StatCard label={t.releasedFunds} value={`${money(releasedFundsNum)} USDC`} />
          <StatCard label={t.avgProgress} value={`${avgProgressNum}%`} />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-extrabold">{t.portfolio}</h2>
            <div className="text-xs text-white/60">
              {isFa ? "آزادسازی‌ها بر اساس سطح لیگ/رقابت (Tier) انجام می‌شود." : "Releases are tier-based (league level)."}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {portfolio.map((p) => (
              <div key={p.athleteId} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-base font-bold">{p.name}</div>
                    <div className="mt-1 text-xs text-white/65">
                      {p.sport} • {t.invested}: {money(p.invested)} USDC
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <TierPill tier={p.tier} />
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                        {t.progress}: {p.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/athlete/${p.athleteId}?lang=${lang}`}
                      className="rounded-xl bg-[#50FF9D] px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
                    >
                      {t.viewProfile}
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                  {p.escrow.map((e) => (
                    <div key={e.tier} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TierPill tier={e.tier} />
                        <span className="text-xs text-white/70">{e.pct}%</span>
                      </div>
                      <div className="text-xs text-white/70">{statusLabel(e.status)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-16" />
    </main>
  );
}
