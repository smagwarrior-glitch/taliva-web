"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [amount, setAmount] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const close = useCallback(() => {
    setAmount(null);
    setSuccess(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <button
        aria-label={isFa ? "بستن پنجره" : "Close dialog"}
        onClick={close}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", border: "none" }}
      />
      <div
        className="card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invest-dialog-title"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: 420,
          background: "#0b0f14",
        }}
      >
        {!success ? (
          <>
            <h2 id="invest-dialog-title" style={{ fontSize: 18, fontWeight: 900 }}>
              {isFa ? "سرمایه‌گذاری (دمو)" : "Invest (Demo)"}
            </h2>
            <div className="small" style={{ marginTop: 6 }}>
              {isFa ? "ورزشکار:" : "Athlete:"} <b>{athleteName}</b>
            </div>

            <div id="amount-label" style={{ marginTop: 14 }} className="small">
              {isFa ? "مبلغ (USDC)" : "Amount (USDC)"}
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              {[100, 250, 500].map((v) => (
                <button
                  key={v}
                  aria-describedby="amount-label"
                  className={`btn ${amount === v ? "btn-primary" : ""}`}
                  onClick={() => setAmount(v)}
                  type="button"
                  style={{ flex: 1 }}
                >
                  {v} USDC
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={!amount}
              onClick={() => setSuccess(true)}
              style={{ width: "100%", marginTop: 14, opacity: !amount ? 0.5 : 1 }}
            >
              {isFa ? "تأیید" : "Confirm"}
            </button>

            <button type="button" className="btn" onClick={close} style={{ width: "100%", marginTop: 10 }}>
              {isFa ? "انصراف" : "Cancel"}
            </button>
          </>
        ) : (
          <>
            <h2 id="invest-dialog-title" style={{ fontSize: 18, fontWeight: 900, color: "#50FF90" }}>
              {isFa ? "ثبت شد 🎉" : "Success 🎉"}
            </h2>
            <div className="small" style={{ marginTop: 8 }}>
              {isFa ? "این یک تراکنش دمو بود. پول واقعی جابه‌جا نشد." : "This was a demo. No real funds moved."}
            </div>
            <button type="button" className="btn btn-primary" onClick={close} style={{ width: "100%", marginTop: 14 }}>
              {isFa ? "بستن" : "Close"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
