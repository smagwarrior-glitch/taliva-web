import Link from "next/link";
import { cookies } from "next/headers";
import SignOutButton from "@/app/components/SignOutButton";
import { athletes } from "@/app/lib/athletes";
import { getLang, type SearchParams } from "@/app/lib/i18n";
import { ACCESS_COOKIE } from "@/app/lib/supabase/auth";
import { getSupabaseConfig } from "@/app/lib/supabase/config";
import {
  getMyInvestments,
  type InvestmentRow,
} from "@/app/lib/supabase/database";

type Tier = "D" | "C" | "B" | "A";
type EscrowStatus = "released" | "pending" | "locked" | "cancelled";

type PortfolioItem = {
  id: string;
  athleteId: string;
  athleteKnown: boolean;
  name: string;
  sport: string;
  invested: number;
  currency: "USDC";
  tier: Tier;
  progress: number;
  escrow: Array<{ tier: Tier; pct: number; status: EscrowStatus }>;
};

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

function databasePortfolio(rows: InvestmentRow[], lang: "fa" | "en"): PortfolioItem[] {
  return rows.map((row) => {
    const athlete = athletes.find((candidate) => candidate.id === row.athlete_reference);
    const escrow = [...row.escrow_milestones]
      .sort((a, b) => a.position - b.position)
      .map((stage) => ({
        tier: stage.tier,
        pct: stage.allocation_bps / 100,
        status: stage.status,
      }));
    const releasedPercent = escrow
      .filter((stage) => stage.status === "released")
      .reduce((sum, stage) => sum + stage.pct, 0);
    const currentTier =
      escrow.find((stage) => stage.status === "pending")?.tier ??
      [...escrow].reverse().find((stage) => stage.status === "released")?.tier ??
      "D";

    return {
      id: row.id,
      athleteId: row.athlete_reference,
      athleteKnown: Boolean(athlete),
      name: athlete?.name[lang] ?? (lang === "fa" ? `ورزشکار ${row.athlete_reference}` : `Athlete ${row.athlete_reference}`),
      sport: athlete?.sport[lang] ?? (lang === "fa" ? "در انتظار اطلاعات ورزشکار" : "Athlete data pending"),
      invested: Number(row.amount),
      currency: row.currency,
      tier: currentTier,
      progress: releasedPercent,
      escrow,
    };
  });
}

function demoPortfolio(lang: "fa" | "en"): PortfolioItem[] {
  const rows = [
    {
      id: "demo-a1",
      athlete: athletes[0],
      invested: 500,
      tier: "C" as const,
      escrow: [
        { tier: "D" as const, pct: 10, status: "released" as const },
        { tier: "C" as const, pct: 20, status: "pending" as const },
        { tier: "B" as const, pct: 30, status: "locked" as const },
        { tier: "A" as const, pct: 40, status: "locked" as const },
      ],
    },
    {
      id: "demo-a2",
      athlete: athletes[1],
      invested: 300,
      tier: "D" as const,
      escrow: [
        { tier: "D" as const, pct: 10, status: "pending" as const },
        { tier: "C" as const, pct: 20, status: "locked" as const },
        { tier: "B" as const, pct: 30, status: "locked" as const },
        { tier: "A" as const, pct: 40, status: "locked" as const },
      ],
    },
    {
      id: "demo-a3",
      athlete: athletes[2],
      invested: 250,
      tier: "C" as const,
      escrow: [
        { tier: "D" as const, pct: 10, status: "released" as const },
        { tier: "C" as const, pct: 20, status: "released" as const },
        { tier: "B" as const, pct: 30, status: "pending" as const },
        { tier: "A" as const, pct: 40, status: "locked" as const },
      ],
    },
  ];

  return rows.map((row) => ({
    id: row.id,
    athleteId: row.athlete.id,
    athleteKnown: true,
    name: row.athlete.name[lang],
    sport: row.athlete.sport[lang],
    invested: row.invested,
    currency: "USDC",
    tier: row.tier,
    progress: row.escrow
      .filter((stage) => stage.status === "released")
      .reduce((sum, stage) => sum + stage.pct, 0),
    escrow: row.escrow,
  }));
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
  const configured = Boolean(getSupabaseConfig());
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  let dataError = false;
  let portfolio: PortfolioItem[];

  if (configured && accessToken) {
    try {
      portfolio = databasePortfolio(await getMyInvestments(accessToken), lang);
    } catch {
      portfolio = [];
      dataError = true;
    }
  } else {
    portfolio = demoPortfolio(lang);
  }

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
      progress: "Released",
      released: "Released",
      pending: "Pending",
      locked: "Locked",
      cancelled: "Cancelled",
      empty: "You do not have any investments yet.",
      error: "Investment data could not be loaded. Please try again.",
      demo: "Demo data — connect Supabase environment variables to activate personal accounts.",
      connected: "Secure account data",
    },
    fa: {
      title: "داشبورد سرمایه‌گذار",
      portfolio: "پورتفولیو",
      totalInvested: "کل سرمایه‌گذاری",
      activeAthletes: "ورزشکاران فعال",
      releasedFunds: "مبالغ آزادشده",
      avgProgress: "میانگین آزادسازی",
      viewProfile: "مشاهده پروفایل",
      invested: "سرمایه‌گذاری",
      progress: "آزادشده",
      released: "آزاد شد",
      pending: "در انتظار",
      locked: "قفل",
      cancelled: "لغوشده",
      empty: "هنوز سرمایه‌گذاری‌ای در حساب شما ثبت نشده است.",
      error: "اطلاعات سرمایه‌گذاری بارگذاری نشد. دوباره تلاش کنید.",
      demo: "داده نمایشی — با تنظیم متغیرهای Supabase حساب شخصی فعال می‌شود.",
      connected: "اطلاعات امن حساب",
    },
  }[lang];

  const totalInvested = portfolio.reduce((sum, item) => sum + item.invested, 0);
  const releasedFunds = portfolio.reduce((sum, item) => {
    const releasedPercent = item.escrow
      .filter((stage) => stage.status === "released")
      .reduce((stageSum, stage) => stageSum + stage.pct, 0);
    return sum + (item.invested * releasedPercent) / 100;
  }, 0);
  const avgProgress = portfolio.length
    ? Math.round(portfolio.reduce((sum, item) => sum + item.progress, 0) / portfolio.length)
    : 0;
  const activeAthletes = new Set(portfolio.map((item) => item.athleteId)).size;

  const statusLabel = (status: EscrowStatus) => {
    if (status === "released") return `${t.released} ✅`;
    if (status === "pending") return `${t.pending} ⏳`;
    if (status === "cancelled") return `${t.cancelled} ✕`;
    return `${t.locked} 🔒`;
  };

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>
            <p className="mt-2 text-xs text-white/60">{configured ? t.connected : t.demo}</p>
          </div>
          {configured && <SignOutButton lang={lang} />}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label={t.totalInvested} value={`${number.format(totalInvested)} USDC`} />
          <StatCard label={t.activeAthletes} value={number.format(activeAthletes)} />
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

          {dataError ? (
            <p className="mt-5 field-error" role="alert">{t.error}</p>
          ) : portfolio.length === 0 ? (
            <p className="mt-5 text-sm text-white/70">{t.empty}</p>
          ) : (
            <div className="mt-5 space-y-4">
              {portfolio.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-base font-bold">{item.name}</div>
                      <div className="mt-1 text-xs text-white/65">
                        {item.sport} • {t.invested}: {number.format(item.invested)} {item.currency}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <TierPill tier={item.tier} />
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                          {t.progress}: {number.format(item.progress)}%
                        </span>
                      </div>
                    </div>

                    {item.athleteKnown && (
                      <Link
                        href={`/athlete/${item.athleteId}?lang=${lang}`}
                        className="rounded-xl bg-[#50FF9D] px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
                      >
                        {t.viewProfile}
                      </Link>
                    )}
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
          )}
        </div>
      </section>
    </main>
  );
}
