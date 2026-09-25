import Link from "next/link";
import { athletes } from "@/app/lib/athletes";
import { getLang, type SearchParams } from "@/app/lib/i18n";

type Tier = "D" | "C" | "B" | "A";
type EscrowStatus = "released" | "pending" | "locked";

function TierPill({ tier }: { tier: Tier }) {
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
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US", {
    maximumFractionDigits: 2,
  });

  const t = {
    en: {
      title: "Investor Dashboard",
      portfolio: "Portfolio",
      totalInvested: "Total Invested",
      activeAthletes: "Active Athletes",
      releasedFunds: "Released Funds",
      avgProgress: "Avg. Progress",
      viewProfile: "View Profile",
      invested: "Invested",
      progress: "Progress",
      released: "Released",
      pending: "Pending",
      locked: "Locked",
    },
    fa: {
      title: "داشبورد سرمایه‌گذار",
      portfolio: "پورتفولیو",
      totalInvested: "کل سرمایه‌گذاری",
      activeAthletes: "ورزشکاران فعال",
      releasedFunds: "مبالغ آزادشده",
      avgProgress: "میانگین پیشرفت",
      viewProfile: "مشاهده پروفایل",
      invested: "سرمایه‌گذاری",
      progress: "پیشرفت",
      released: "آزاد شد",
      pending: "در انتظار",
      locked: "قفل",
    },
  }[lang];

  const portfolio: Array<{
    athlete: (typeof athletes)[number];
    invested: number;
    tier: Tier;
    escrow: Array<{ tier: Tier; pct: number; status: EscrowStatus }>;
  }> = [
    {
      athlete: athletes[0],
      invested: 500,
      tier: "C",
      escrow: [
        { tier: "D", pct: 10, status: "released" },
        { tier: "C", pct: 20, status: "pending" },
        { tier: "B", pct: 30, status: "locked" },
        { tier: "A", pct: 40, status: "locked" },
      ],
    },
    {
      athlete: athletes[1],
      invested: 300,
      tier: "D",
      escrow: [
        { tier: "D", pct: 10, status: "pending" },
        { tier: "C", pct: 20, status: "locked" },
        { tier: "B", pct: 30, status: "locked" },
        { tier: "A", pct: 40, status: "locked" },
      ],
    },
    {
      athlete: athletes[2],
      invested: 250,
      tier: "C",
      escrow: [
        { tier: "D", pct: 10, status: "released" },
        { tier: "C", pct: 20, status: "released" },
        { tier: "B", pct: 30, status: "pending" },
        { tier: "A", pct: 40, status: "locked" },
      ],
    },
  ];

  const totalInvested = portfolio.reduce((sum, item) => sum + item.invested, 0);
  const releasedFunds = portfolio.reduce((sum, item) => {
    const releasedPercent = item.escrow
      .filter((stage) => stage.status === "released")
      .reduce((stageSum, stage) => stageSum + stage.pct, 0);

    return sum + (item.invested * releasedPercent) / 100;
  }, 0);
  const avgProgress = Math.round(
    portfolio.reduce((sum, item) => sum + item.athlete.tierWeight, 0) / portfolio.length,
  );

  const statusLabel = (status: EscrowStatus) => {
    if (status === "released") return `${t.released} ✅`;
    if (status === "pending") return `${t.pending} ⏳`;
    return `${t.locked} 🔒`;
  };

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label={t.totalInvested} value={`${number.format(totalInvested)} USDC`} />
          <StatCard label={t.activeAthletes} value={number.format(portfolio.length)} />
          <StatCard label={t.releasedFunds} value={`${number.format(releasedFunds)} USDC`} />
          <StatCard label={t.avgProgress} value={`${number.format(avgProgress)}%`} />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-xl font-extrabold">{t.portfolio}</h2>
            <div className="text-xs text-white/60">
              {isFa ? "آزادسازی‌ها بر اساس سطح لیگ/رقابت انجام می‌شود." : "Releases are based on competition tier."}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {portfolio.map((item) => (
              <div key={item.athlete.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-base font-bold">{item.athlete.name[lang]}</div>
                    <div className="mt-1 text-xs text-white/65">
                      {item.athlete.sport[lang]} • {t.invested}: {number.format(item.invested)} USDC
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <TierPill tier={item.tier} />
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                        {t.progress}: {number.format(item.athlete.tierWeight)}%
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/athlete/${item.athlete.id}?lang=${lang}`}
                    className="rounded-xl bg-[#50FF9D] px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
                  >
                    {t.viewProfile}
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                  {item.escrow.map((stage) => (
                    <div key={stage.tier} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TierPill tier={stage.tier} />
                        <span className="text-xs text-white/70">{number.format(stage.pct)}%</span>
                      </div>
                      <div className="text-xs text-white/70">{statusLabel(stage.status)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
