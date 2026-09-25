"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Lang = "fa" | "en";
type Mode = "sign-in" | "sign-up";

export default function AuthForm({
  lang,
  returnTo,
}: {
  lang: Lang;
  returnTo: string;
}) {
  const isFa = lang === "fa";
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      displayName: String(form.get("displayName") ?? ""),
      locale: lang,
    };

    try {
      const response = await fetch(
        mode === "sign-up" ? "/api/auth/sign-up" : "/api/auth/sign-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as {
        error?: string;
        confirmationRequired?: boolean;
      };

      if (!response.ok) {
        setError(result.error ?? (isFa ? "عملیات ناموفق بود." : "Request failed."));
        return;
      }

      if (result.confirmationRequired) {
        setNotice(
          isFa
            ? "حساب ساخته شد. لینک تأیید ارسال‌شده به ایمیل را باز کنید."
            : "Account created. Open the confirmation link sent to your email.",
        );
        setMode("sign-in");
        return;
      }

      router.push(returnTo);
      router.refresh();
    } catch {
      setError(isFa ? "ارتباط با سرور برقرار نشد." : "Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card mx-auto max-w-md">
      <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          className={`btn flex-1 ${mode === "sign-in" ? "btn-primary" : ""}`}
          onClick={() => {
            setMode("sign-in");
            setError("");
            setNotice("");
          }}
        >
          {isFa ? "ورود" : "Sign in"}
        </button>
        <button
          type="button"
          className={`btn flex-1 ${mode === "sign-up" ? "btn-primary" : ""}`}
          onClick={() => {
            setMode("sign-up");
            setError("");
            setNotice("");
          }}
        >
          {isFa ? "ساخت حساب" : "Create account"}
        </button>
      </div>

      <h1 className="text-2xl font-extrabold">
        {mode === "sign-in"
          ? isFa
            ? "ورود سرمایه‌گذار"
            : "Investor sign in"
          : isFa
            ? "ساخت حساب سرمایه‌گذار"
            : "Create investor account"}
      </h1>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        {mode === "sign-up" && (
          <label>
            {isFa ? "نام نمایشی" : "Display name"}
            <input
              name="displayName"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
            />
          </label>
        )}

        <label>
          {isFa ? "ایمیل" : "Email"}
          <input name="email" type="email" autoComplete="email" dir="ltr" required />
        </label>

        <label>
          {isFa ? "رمز عبور" : "Password"}
          <input
            name="password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            minLength={8}
            required
          />
        </label>

        {error && <p className="field-error" role="alert">{error}</p>}
        {notice && <p className="text-sm text-[#50FF90]" role="status">{notice}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? isFa
              ? "در حال پردازش…"
              : "Working…"
            : mode === "sign-in"
              ? isFa
                ? "ورود"
                : "Sign in"
              : isFa
                ? "ساخت حساب"
                : "Create account"}
        </button>
      </form>
    </div>
  );
}
