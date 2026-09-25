"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Lang = "fa" | "en";

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setAmount(null);
    setSuccess(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
      (firstFocusable ?? dialogRef.current)?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={isFa ? "بستن پنجره" : "Close dialog"}
        onClick={close}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", border: "none" }}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
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
              {[100, 250, 500].map((value) => (
                <button
                  key={value}
                  aria-describedby="amount-label"
                  aria-pressed={amount === value}
                  className={`btn ${amount === value ? "btn-primary" : ""}`}
                  onClick={() => setAmount(value)}
                  type="button"
                  style={{ flex: 1 }}
                >
                  {value} USDC
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
          <div aria-live="polite">
            <h2 id="invest-dialog-title" style={{ fontSize: 18, fontWeight: 900, color: "#50FF90" }}>
              {isFa ? "ثبت شد 🎉" : "Success 🎉"}
            </h2>
            <div className="small" style={{ marginTop: 8 }}>
              {isFa ? "این یک تراکنش دمو بود. پول واقعی جابه‌جا نشد." : "This was a demo. No real funds moved."}
            </div>
            <button type="button" className="btn btn-primary" onClick={close} style={{ width: "100%", marginTop: 14 }}>
              {isFa ? "بستن" : "Close"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
