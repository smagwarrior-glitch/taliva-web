"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lang } from "@/app/lib/i18n";

export default function SignOutButton({ lang }: { lang: Lang }) {
  const isFa = lang === "fa";
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function signOut() {
    setSubmitting(true);
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.push(`/?lang=${lang}`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button type="button" className="btn" onClick={signOut} disabled={submitting}>
      {submitting ? (isFa ? "در حال خروج…" : "Signing out…") : (isFa ? "خروج" : "Sign out")}
    </button>
  );
}
