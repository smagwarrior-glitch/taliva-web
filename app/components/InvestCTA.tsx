"use client";

import { useState } from "react";
import InvestModal from "./InvestModal";

type Lang = "fa" | "en";

export default function InvestCTA({
  lang,
  athleteName,
}: {
  lang: Lang;
  athleteName: string;
}) {
  const [open, setOpen] = useState(false);
  const isFa = lang === "fa";

  return (
    <>
      {/* CTA Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 w-full rounded-xl bg-[#50FF90] px-4 py-3 text-black font-semibold"
      >
        {isFa ? "سرمایه‌گذاری (دمو)" : "Invest (Demo)"}
      </button>

      {/* Modal */}
      <InvestModal
        open={open}
        onClose={() => setOpen(false)}
        lang={lang}
        athleteName={athleteName}
      />
    </>
  );
}
