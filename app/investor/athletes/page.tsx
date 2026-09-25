import Link from "next/link";
import LangSwitch from "@/app/components/LangSwitch";
import { athletes } from "@/app/lib/athletes";
import { getLang, type SearchParams } from "@/app/lib/i18n";

export default async function InvestorAthletes({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const lang = getLang(await searchParams);
  const isFa = lang === "fa";

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/?lang=${lang}`} className="small">
          {isFa ? "→ خانه" : "← Home"}
        </Link>
        <LangSwitch hrefBase="/investor/athletes" lang={lang} />
      </div>

      <h1 style={{ marginTop: 14, fontSize: 22, fontWeight: 900 }}>
        {isFa ? "لیست ورزشکاران" : "Athletes"}
      </h1>

      <div className="grid" style={{ marginTop: 12 }}>
        {athletes.map((athlete) => (
          <div key={athlete.id} className="card col-4">
            <div style={{ fontWeight: 900 }}>{athlete.name[lang]}</div>
            <div className="small">{athlete.sport[lang]} • TALIVA {athlete.score}</div>
            <div style={{ marginTop: 12 }} className="row">
              <Link className="btn btn-primary" href={`/athlete/${athlete.id}?lang=${lang}`}>
                {isFa ? "مشاهده پروفایل" : "View Profile"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
