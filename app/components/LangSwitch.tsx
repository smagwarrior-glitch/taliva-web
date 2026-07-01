import Link from "next/link";

type Lang = "fa" | "en";

export default function LangSwitch({ hrefBase, lang }: { hrefBase: string; lang: Lang }) {
  return (
    <div className="card" style={{ padding: 10, borderRadius: 999, display: "inline-flex", gap: 10 }}>
      <Link href={`${hrefBase}?lang=fa`} style={{ fontWeight: lang === "fa" ? 800 : 400, opacity: lang === "fa" ? 1 : 0.7 }}>
        FA
      </Link>
      <span style={{ opacity: 0.5 }}>|</span>
      <Link href={`${hrefBase}?lang=en`} style={{ fontWeight: lang === "en" ? 800 : 400, opacity: lang === "en" ? 1 : 0.7 }}>
        EN
      </Link>
    </div>
  );
}