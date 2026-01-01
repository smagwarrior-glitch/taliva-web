"use client";

import { useEffect, useState } from "react";

type Lang = "fa" | "en";

export default function InvestModal({
  open,
  onClose,
  lang,
  athleteName,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  athleteName: string;
}) {
  const isFa = lang === "fa";
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (!open) setAmount("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0b0f14] p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-white/70">
              {isFa ? "ورزشکار:" : "Athlete:"}
            </div>
            <div className="text-lg font-bold">{athleteName}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-white/70 hover:bg-white/10"
          >
            {isFa ? "بستن" : "Close"}
          </button>
        </div>

        <div className="mt-4">
          <label className="text-sm text-white/70">
            {isFa ? "مبلغ (USDC)" : "Amount (USDC)"}
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={isFa ? "مثلاً 100" : "e.g. 100"}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            alert(isFa ? "دمو: ثبت شد ✅" : "Demo: Submitted ✅");
            onClose();
          }}
          className="mt-4 w-full rounded-xl bg-[#50FF9D] px-4 py-3 text-sm font-semibold text-black"
        >
          {isFa ? "تایید سرمایه‌گذاری (دمو)" : "Confirm Investment (Demo)"}
        </button>

        <p className="mt-3 text-xs text-white/50">
          {isFa
            ? "این فقط دمو است و تراکنش واقعی انجام نمی‌شود."
            : "This is a demo. No real transaction happens."}
        </p>
      </div>
    </div>
  );
}