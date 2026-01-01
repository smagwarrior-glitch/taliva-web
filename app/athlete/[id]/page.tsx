// app/athlete/[id]/page.tsx

import InvestCTA from "@/app/components/InvestCTA";

type Lang = "fa" | "en";

function getLang(searchParams: Record<string, string | string[] | undefined>): Lang {
  const raw = searchParams.lang;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "fa" ? "fa" : "en";
}

function money(n: number) {
  return n.toLocaleString();
}

function pct(n: number) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

type Athlete = {
  id: string;
  nameEn: string;
  nameFa: string;
  sportEn: string;
  sportFa: string;
  cityEn: string;
  cityFa: string;
  score: number;
  tier: "A" | "B" | "C" | "D";
  tierWeight: number; // (درصد)
  goal: number; // USDC
  raised: number; // USDC
  bioEn: string;
  bioFa: string;
};

export default function AthleteProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang(searchParams);

  // ⚠️ این بخش Sample هست. اگر دیتات رو از DB/API می‌گیری، همین athlete رو با داده واقعی جایگزین کن.
  const athlete: Athlete = {
    id: params.id,
    nameEn: "Sample Athlete",
    nameFa: "ورزشکار نمونه",
    sportEn: "Football",
    sportFa: "فوتبال",
    cityEn: "Tehran",
    cityFa: "تهران",
    score: 84,
    tier: "C",
    tierWeight: 60,
    goal: 10000,
    raised: 2500,
    bioEn: "Short bio about the athlete.",
    bioFa: "یک بیو کوتاه درباره ورزشکار.",
  };

  const athleteName = lang === "fa" ? athlete.nameFa : athlete.nameEn;
  const sport = lang === "fa" ? athlete.sportFa : athlete.sportEn;
  const city = lang === "fa" ? athlete.cityFa : athlete.cityEn;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{athleteName}</h1>
      <p className="mt-2 text-gray-600">
        {sport} • {city} • TALIVA Score {athlete.score}
      </p>

      <div className="mt-6">
        {/* ✅ جای درست InvestCTA: داخل return */}
        <InvestCTA lang={lang} athleteName={athleteName} />
      </div>

      <div className="mt-8 space-y-2">
        <div>
          <span className="font-semibold">{lang === "fa" ? "هدف:" : "Goal:"}</span>{" "}
          {money(athlete.goal)} USDC
        </div>
        <div>
          <span className="font-semibold">{lang === "fa" ? "جمع‌آوری شده:" : "Raised:"}</span>{" "}
          {money(athlete.raised)} USDC
        </div>
        <div>
          <span className="font-semibold">{lang === "fa" ? "پیشرفت:" : "Progress:"}</span>{" "}
          {pct((athlete.raised / Math.max(1, athlete.goal)) * 100)}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">{lang === "fa" ? "داستان" : "Story"}</h2>
        <p className="mt-2 text-gray-700">{lang === "fa" ? athlete.bioFa : athlete.bioEn}</p>
      </div>
    </main>
  );
}