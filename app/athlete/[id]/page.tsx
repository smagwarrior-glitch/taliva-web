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

  const a = getAthlete(id);
  if (!a) notFound();
  const fundedPct = (a.raised / a.goal) * 100;
  const athleteName = a.name[lang];

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/investor/athletes?lang=${lang}`} className="small">← {isFa ? "بازگشت" : "Back"}</Link>
        <LangSwitch hrefBase={`/athlete/${id}`} lang={lang} />
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card col-8">
          <div style={{ fontSize: 26, fontWeight: 1000 }}>{athleteName}</div>
          <div className="small" style={{ marginTop: 6 }}>
            {a.sport[lang]} • TALIVA {a.score}
          </div>

          <div className="card" style={{ marginTop: 14, background: "rgba(0,0,0,0.25)" }}>
            <div className="small">{isFa ? "شاخص ارزش متوسط" : "Avg Value Indicator"}</div>
            <div className="progress" style={{ marginTop: 8 }}>
              <div style={{ width: pct(a.tierWeight) }} />
            </div>
            <div className="small" style={{ marginTop: 8 }}>{pct(a.tierWeight)}</div>
          </div>
        </div>

        <div className="card col-4">
          <div style={{ fontWeight: 900 }}>{isFa ? "جذب سرمایه" : "Funding"}</div>
          <div className="small" style={{ marginTop: 10 }}>
            {isFa ? "جمع‌شده" : "Raised"}: <b>{a.raised}</b> / {a.goal} USDC
          </div>
          <div className="progress" style={{ marginTop: 10 }}>
            <div style={{ width: pct(fundedPct) }} />
          </div>
          <div className="small" style={{ marginTop: 8 }}>{pct(fundedPct)} funded</div>

          <div style={{ marginTop: 12 }}>
            <InvestCTA lang={lang} athleteName={athleteName} />
          </div>

          <div style={{ marginTop: 10 }}>
            <Link className="btn" style={{ width: "100%" }} href={`/athlete/apply?lang=${lang}`}>
              {isFa ? "اپلای ورزشکار" : "Athlete apply"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
