import Link from "next/link";
import LangSwitch from "@/app/components/LangSwitch";

type Lang = "fa" | "en";
function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

const athletes = [
  { id: "a1", en: "Sample Athlete 1", fa: "نمونه ورزشکار ۱", sportEn: "Football", sportFa: "فوتبال", score: 84 },
  { id: "a2", en: "Sample Athlete 2", fa: "نمونه ورزشکار ۲", sportEn: "Wrestling", sportFa: "کشتی", score: 78 },
  { id: "a3", en: "Sample Athlete 3", fa: "نمونه ورزشکار ۳", sportEn: "Volleyball", sportFa: "والیبال", score: 81 },
];

export default function InvestorAthletes({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/?lang=${lang}`} className="small">← {isFa ? "خانه" : "Home"}</Link>
        <LangSwitch hrefBase="/investor/athletes" lang={lang} />
      </div>

      <h1 style={{ marginTop: 14, fontSize: 22, fontWeight: 900 }}>
        {isFa ? "لیست ورزشکاران" : "Athletes"}
      </h1>

      <div className="grid" style={{ marginTop: 12 }}>
        {athletes.map((a) => (
          <div key={a.id} className="card col-4">
            <div style={{ fontWeight: 900 }}>{isFa ? a.fa : a.en}</div>
            <div className="small">{isFa ? a.sportFa : a.sportEn} • TALIVA {a.score}</div>
            <div style={{ marginTop: 12 }} className="row">
              <Link className="btn btn-primary" href={`/athlete/${a.id}?lang=${lang}`}>
                {isFa ? "مشاهده پروفایل" : "View Profile"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}