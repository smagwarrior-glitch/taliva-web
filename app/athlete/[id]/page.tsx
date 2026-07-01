import Link from "next/link";
import LangSwitch from "@/app/components/LangSwitch";
import InvestCTA from "@/app/components/InvestCTA";

type Lang = "fa" | "en";
function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}
function pct(n: number) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

const athletes: Record<string, any> = {
  a1: { en: "Sample Athlete 1", fa: "نمونه ورزشکار ۱", sportEn: "Football", sportFa: "فوتبال", score: 84, goal: 5000, raised: 3100, tierWeight: 62 },
  a2: { en: "Sample Athlete 2", fa: "نمونه ورزشکار ۲", sportEn: "Wrestling", sportFa: "کشتی", score: 78, goal: 5000, raised: 2050, tierWeight: 48 },
  a3: { en: "Sample Athlete 3", fa: "نمونه ورزشکار ۳", sportEn: "Volleyball", sportFa: "والیبال", score: 81, goal: 5000, raised: 2750, tierWeight: 58 },
};

export default function AthleteProfile({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  const a = athletes[params.id] ?? athletes.a1;
  const fundedPct = (a.raised / a.goal) * 100;
  const athleteName = isFa ? a.fa : a.en;

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/investor/athletes?lang=${lang}`} className="small">← {isFa ? "بازگشت" : "Back"}</Link>
        <LangSwitch hrefBase={`/athlete/${params.id}`} lang={lang} />
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card col-8">
          <div style={{ fontSize: 26, fontWeight: 1000 }}>{athleteName}</div>
          <div className="small" style={{ marginTop: 6 }}>
            {isFa ? a.sportFa : a.sportEn} • TALIVA {a.score}
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