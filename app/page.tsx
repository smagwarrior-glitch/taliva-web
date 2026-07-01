import Link from "next/link";
import LangSwitch from "./components/LangSwitch";

type Lang = "fa" | "en";

function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

export default function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const lang = getLang(searchParams);
  const isFa = lang === "fa";

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 1000 }}>TALIVA</div>
          <div className="small">{isFa ? "کشف استعداد + سرمایه‌گذاری" : "Talent discovery + investment"}</div>
        </div>
        <LangSwitch hrefBase="/" lang={lang} />
      </div>

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card col-8">
          <div style={{ fontSize: 18, fontWeight: 900 }}>{isFa ? "برای سرمایه‌گذاران" : "For Investors"}</div>
          <div className="small" style={{ marginTop: 8 }}>
            {isFa ? "ورزشکارها را ببین، پروفایل‌ها را بررسی کن، دمو سرمایه‌گذاری کن." : "Browse athletes, review profiles, invest (demo)."}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link className="btn btn-primary" href={`/investor/athletes?lang=${lang}`}>
              {isFa ? "ورود سرمایه‌گذار" : "Investor portal"}
            </Link>
          </div>
        </div>

        <div className="card col-4">
          <div style={{ fontSize: 18, fontWeight: 900 }}>{isFa ? "برای ورزشکاران" : "For Athletes"}</div>
          <div className="small" style={{ marginTop: 8 }}>
            {isFa ? "فرم اپلای را پر کن و پروفایل بساز." : "Apply and create your profile."}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link className="btn" href={`/athlete/apply?lang=${lang}`}>
              {isFa ? "اپلای ورزشکار" : "Athlete apply"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}