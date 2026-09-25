"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LangSwitch from "./LangSwitch";
import type { Lang } from "../lib/i18n";

export default function Header() {
  const pathname = usePathname();
  const params = useSearchParams();
  const lang: Lang = params.get("lang") === "fa" ? "fa" : "en";
  const withLang = (path: string) => `${path}?lang=${lang}`;

  const preservedParams = new URLSearchParams(params.toString());
  preservedParams.delete("lang");
  const preservedQuery = preservedParams.toString();
  const languageSwitchBase = preservedQuery ? `${pathname}?${preservedQuery}` : pathname;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <header className="site-header" dir={lang === "fa" ? "rtl" : "ltr"}>
      <div className="site-header-inner">
        <Link href={withLang("/")} className="text-xl font-extrabold tracking-wide" aria-label={lang === "fa" ? "خانه تالیوا" : "TALIVA home"}>
          TALIVA
        </Link>
        <nav className="site-nav text-sm text-white/80" aria-label={lang === "fa" ? "پیمایش اصلی" : "Main navigation"}>
          <Link href={withLang("/")}>{lang === "fa" ? "خانه" : "Home"}</Link>
          <Link href={withLang("/investor/dashboard")}>{lang === "fa" ? "داشبورد" : "Dashboard"}</Link>
          <Link href={withLang("/investor/athletes")}>{lang === "fa" ? "ورزشکاران" : "Athletes"}</Link>
          <LangSwitch hrefBase={languageSwitchBase} lang={lang} />
        </nav>
      </div>
    </header>
  );
}
