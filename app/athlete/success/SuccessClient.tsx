"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Lang = "fa" | "en";
function getLang(sp: URLSearchParams): Lang {
  return sp.get("lang") === "fa" ? "fa" : "en";
}

export default function SuccessClient() {
  const sp = useSearchParams();
  const lang = getLang(sp);
  const isFa = lang === "fa";

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="card">
        <div style={{ fontSize: 22, fontWeight: 1000, color: "#50FF90" }}>
          {isFa ? "ثبت شد ✅" : "Submitted ✅"}
        </div>
        <p className="small" style={{ marginTop: 10 }}>
          {isFa ? "پروفایل شما در صف بررسی قرار گرفت (دمو)." : "Your profile is in review queue (demo)."}
        </p>

        <div className="row" style={{ marginTop: 14 }}>
          <Link className="btn btn-primary" href={`/investor/athletes?lang=${lang}`} style={{ flex: 1 }}>
            {isFa ? "رفتن به لیست سرمایه‌گذار" : "Go to investor list"}
          </Link>
          <Link className="btn" href={`/?lang=${lang}`} style={{ flex: 1 }}>
            {isFa ? "خانه" : "Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}