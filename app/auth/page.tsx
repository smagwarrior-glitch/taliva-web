import AuthForm from "./AuthForm";
import { getLang, type SearchParams } from "@/app/lib/i18n";

function safeReturnTo(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/") && !candidate.startsWith("//")
    ? candidate
    : "/investor/dashboard";
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const lang = getLang(query);
  const isFa = lang === "fa";
  const returnTo = safeReturnTo(query.returnTo);

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <AuthForm lang={lang} returnTo={returnTo} />
    </main>
  );
}
