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
  const [amount, setAmount] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setAmount(null);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <button
        aria-label="close"
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", border: "none" }}
      />
      <div
        className="card"
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
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {isFa ? "سرمایه‌گذاری (دمو)" : "Invest (Demo)"}
            </div>
            <div className="small" style={{ marginTop: 6 }}>
              {isFa ? "ورزشکار:" : "Athlete:"} <b>{athleteName}</b>
            </div>

            <div style={{ marginTop: 14 }} className="small">
              {isFa ? "مبلغ (USDC)" : "Amount (USDC)"}
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              {[100, 250, 500].map((v) => (
                <button
                  key={v}
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

            <button type="button" className="btn" onClick={onClose} style={{ width: "100%", marginTop: 10 }}>
              {isFa ? "انصراف" : "Cancel"}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#50FF90" }}>
              {isFa ? "ثبت شد 🎉" : "Success 🎉"}
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              {isFa ? "این یک تراکنش دمو بود. پول واقعی جابه‌جا نشد." : "This was a demo. No real funds moved."}
            </div>
            <button type="button" className="btn btn-primary" onClick={onClose} style={{ width: "100%", marginTop: 14 }}>
              {isFa ? "بستن" : "Close"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}