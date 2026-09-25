import Link from "next/link";

type Lang = "fa" | "en";

export default function LangSwitch({ hrefBase, lang }: { hrefBase: string; lang: Lang }) {
  const hrefFor = (nextLang: Lang) =>
    `${hrefBase}${hrefBase.includes("?") ? "&" : "?"}lang=${nextLang}`;

  return (
    <div className="card" style={{ padding: 10, borderRadius: 999, display: "inline-flex", gap: 10 }}>
      <Link href={hrefFor("fa")} hrefLang="fa" aria-current={lang === "fa" ? "page" : undefined} style={{ fontWeight: lang === "fa" ? 800 : 400, opacity: lang === "fa" ? 1 : 0.7 }}>
        FA
      </Link>
      <span aria-hidden="true" style={{ opacity: 0.5 }}>|</span>
      <Link href={hrefFor("en")} hrefLang="en" aria-current={lang === "en" ? "page" : undefined} style={{ fontWeight: lang === "en" ? 800 : 400, opacity: lang === "en" ? 1 : 0.7 }}>
        EN
      </Link>
    </div>
  );
}
