"use client";

import { useState } from "react";
import InvestModal from "./InvestModal";

type Lang = "fa" | "en";

export default function InvestCTA({ lang, athleteName }: { lang: Lang; athleteName: string }) {
  const [open, setOpen] = useState(false);
  const isFa = lang === "fa";

  return (
    <>
      <button type="button" className="btn btn-primary" style={{ width: "100%" }} onClick={() => setOpen(true)}>
        {isFa ? "سرمایه‌گذاری (دمو)" : "Invest (Demo)"}
      </button>

      <InvestModal open={open} onClose={() => setOpen(false)} lang={lang} athleteName={athleteName} />
    </>
  );
}