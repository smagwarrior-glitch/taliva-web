import Link from "next/link";
import LangSwitch from "@/app/components/LangSwitch";
import InvestCTA from "@/app/components/InvestCTA";
import { notFound } from "next/navigation";
import { getAthlete } from "@/app/lib/athletes";
import { getLang, type SearchParams } from "@/app/lib/i18n";

function pct(n: number) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

export default async function AthleteProfile({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const lang = getLang(query);
  const isFa = lang === "fa";
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");

  const athlete = getAthlete(id);
  if (!athlete) notFound();

  const fundedPct = (athlete.raised / athlete.goal) * 100;
  const athleteName = athlete.name[lang];

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/investor/athletes?lang=${lang}`} className="small">
          {isFa ? "→ بازگشت" : "← Back"}
        </Link>
        <LangSwitch hrefBase={`/athlete/${id}`} lang={lang} />
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card col-8">
          <div style={{ fontSize: 26, fontWeight: 1000 }}>{athleteName}</div>
          <div className="small" style={{ marginTop: 6 }}>
            {athlete.sport[lang]} • TALIVA {number.format(athlete.score)}
          </div>

          <div className="card" style={{ marginTop: 14, background: "rgba(0,0,0,0.25)" }}>
            <div className="small">{isFa ? "شاخص ارزش متوسط" : "Avg Value Indicator"}</div>
            <div className="progress" style={{ marginTop: 8 }}>
              <div style={{ width: pct(athlete.tierWeight) }} />
            </div>
            <div className="small" style={{ marginTop: 8 }}>{pct(athlete.tierWeight)}</div>
          </div>
        </div>

        <div className="card col-4">
          <div style={{ fontWeight: 900 }}>{isFa ? "جذب سرمایه" : "Funding"}</div>
          <div className="small" style={{ marginTop: 10 }}>
            {isFa ? "جمع‌شده" : "Raised"}: <b>{number.format(athlete.raised)}</b> / {number.format(athlete.goal)} USDC
          </div>
          <div className="progress" style={{ marginTop: 10 }} aria-label={isFa ? "درصد تأمین مالی" : "Funding progress"}>
            <div style={{ width: pct(fundedPct) }} />
          </div>
          <div className="small" style={{ marginTop: 8 }}>
            {pct(fundedPct)} {isFa ? "تأمین شده" : "funded"}
          </div>

          <div style={{ marginTop: 12 }}>
            <InvestCTA lang={lang} athleteName={athleteName} />
          </div>

          <div style={{ marginTop: 10 }}>
            <Link className="btn" style={{ width: "100%" }} href={`/athlete/apply?lang=${lang}&athlete=${id}`}>
              {isFa ? "اپلای ورزشکار" : "Athlete apply"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
