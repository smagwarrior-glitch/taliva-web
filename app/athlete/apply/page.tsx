"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Lang = "fa" | "en";

function getLang(sp: URLSearchParams): Lang {
  const v = sp.get("lang");
  return v === "fa" ? "fa" : "en";
}

const sports = [
  { key: "football", en: "Football", fa: "فوتبال" },
  { key: "volleyball", en: "Volleyball", fa: "والیبال" },
  { key: "wrestling", en: "Wrestling", fa: "کشتی" },
  { key: "tennis", en: "Tennis", fa: "تنیس" },
  { key: "padel", en: "Padel", fa: "پدل" },
];

export default function AthleteApply() {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = useMemo(() => getLang(sp), [sp]);
  const isFa = lang === "fa";

  const t = {
    en: {
      brand: "TALIVA",
      title: "Apply as an Athlete",
      subtitle: "Submit your profile to be evaluated and listed for investment.",
      backHome: "Home",
      investorDash: "Investor Dashboard",
      form: {
        fullName: "Full name",
        age: "Age",
        city: "City",
        sport: "Sport",
        bio: "Short bio",
        achievements: "Achievements (optional)",
        goal: "Funding goal (USDC)",
        contact: "Contact (Telegram/Email)",
        consent: "I confirm the information is accurate.",
        submit: "Submit Application",
      },
      hint: {
        bio: "Tell us about your background, training, and current level.",
        contact: "So we can reach you for verification.",
      },
      required: "Please fill all required fields and accept the consent.",
    },
    fa: {
      brand: "تالیوا",
      title: "ثبت‌نام ورزشکار",
      subtitle: "پروفایل خود را ارسال کنید تا ارزیابی شوید و برای جذب سرمایه نمایش داده شوید.",
      backHome: "خانه",
      investorDash: "داشبورد سرمایه‌گذار",
      form: {
        fullName: "نام و نام خانوادگی",
        age: "سن",
        city: "شهر",
        sport: "رشته",
        bio: "معرفی کوتاه",
        achievements: "افتخارات (اختیاری)",
        goal: "هدف جذب سرمایه (USDC)",
        contact: "راه ارتباطی (تلگرام/ایمیل)",
        consent: "تایید می‌کنم اطلاعات صحیح است.",
        submit: "ارسال درخواست",
      },
      hint: {
        bio: "درباره سابقه، تمرین و سطح فعلی‌ات بنویس.",
        contact: "برای تماس و اعتبارسنجی.",
      },
      required: "لطفاً فیلدهای ضروری را کامل کنید و تیک تایید را بزنید.",
    },
  }[lang];

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("football");
  const [bio, setBio] = useState("");
  const [achievements, setAchievements] = useState("");
  const [goal, setGoal] = useState("5000");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName || !age || !city || !bio || !goal || !contact || !consent) {
      setError(t.required);
      return;
    }

    // MVP: redirect to success page with minimal info
    const q = new URLSearchParams({
      lang,
      name: fullName,
      sport,
      city,
      goal,
    }).toString();

    router.push(`/athlete/apply/success?${q}`);
  }

  return (
    <main className={isFa ? "direction-rtl" : ""}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href={`/?lang=${lang}`} className="text-xl font-extrabold tracking-wide">
          {t.brand}
        </Link>

        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link className="hover:text-white" href={`/?lang=${lang}`}>
            {t.backHome}
          </Link>
          <Link className="hover:text-white" href={`/investor/dashboard?lang=${lang}`}>
            {t.investorDash}
          </Link>

          <div className="ml-2 rounded-full bg-white/10 px-3 py-1">
            <Link className={lang === "fa" ? "font-bold text-white" : ""} href={`/athlete/apply?lang=fa`}>
              FA
            </Link>
            <span className="px-2 opacity-60">|</span>
            <Link className={lang === "en" ? "font-bold text-white" : ""} href={`/athlete/apply?lang=en`}>
              EN
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h1 className="text-3xl font-extrabold md:text-4xl">{t.title}</h1>
        <p className="mt-2 text-white/70">{t.subtitle}</p>

        <form onSubmit={onSubmit} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm">
              <div className="mb-1 text-white/80">{t.form.fullName} *</div>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-white/80">{t.form.age} *</div>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                inputMode="numeric"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-white/80">{t.form.city} *</div>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-white/80">{t.form.sport} *</div>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
              >
                {sports.map((s) => (
                  <option key={s.key} value={s.key}>
                    {isFa ? s.fa : s.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm md:col-span-2">
              <div className="mb-1 text-white/80">{t.form.bio} *</div>
              <textarea
                className="min-h-[110px] w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="mt-1 text-xs text-white/50">{t.hint.bio}</div>
            </label>

            <label className="text-sm md:col-span-2">
              <div className="mb-1 text-white/80">{t.form.achievements}</div>
              <textarea
                className="min-h-[90px] w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-white/80">{t.form.goal} *</div>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                inputMode="numeric"
              />
            </label>

            <label className="text-sm">
              <div className="mb-1 text-white/80">{t.form.contact} *</div>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/25"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <div className="mt-1 text-xs text-white/50">{t.hint.contact}</div>
            </label>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#50FF9D]"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{t.form.consent}</span>
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#50FF9D] px-6 py-3 text-sm font-semibold text-black hover:brightness-95"
          >
            {t.form.submit}
          </button>
        </form>
      </section>
    </main>
  );
}