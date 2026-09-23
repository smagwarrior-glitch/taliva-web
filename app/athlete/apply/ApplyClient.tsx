"use client";

import { type FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Lang } from "@/app/lib/i18n";

type Fields = "name" | "email" | "sport" | "age" | "bio";
type Errors = Partial<Record<Fields, string>>;

export default function ApplyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang: Lang = searchParams.get("lang") === "fa" ? "fa" : "en";
  const isFa = lang === "fa";
  const athleteId = searchParams.get("athlete");
  const [errors, setErrors] = useState<Errors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: Fields) => String(data.get(name) ?? "").trim();
    const next: Errors = {};
    if (value("name").length < 2) next.name = isFa ? "نام باید حداقل ۲ حرف باشد." : "Name must be at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(value("email"))) next.email = isFa ? "ایمیل معتبر وارد کنید." : "Enter a valid email address.";
    if (!value("sport")) next.sport = isFa ? "رشته ورزشی را انتخاب کنید." : "Select a sport.";
    const age = Number(value("age"));
    if (!Number.isInteger(age) || age < 16 || age > 60) next.age = isFa ? "سن باید بین ۱۶ تا ۶۰ باشد." : "Age must be between 16 and 60.";
    if (value("bio").length < 30) next.bio = isFa ? "درباره خودتان حداقل ۳۰ حرف بنویسید." : "Tell us about yourself in at least 30 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) router.push(`/athlete/success?lang=${lang}`);
  }

  const fieldError = (field: Fields) => errors[field] ? <p id={`${field}-error`} className="field-error" role="alert">{errors[field]}</p> : null;

  return (
    <main className={`container ${isFa ? "direction-rtl" : ""}`}>
      <div className="card mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold">{isFa ? "درخواست ورزشکار" : "Athlete application"}</h1>
        <p className="mb-6 text-sm text-white/70">{isFa ? "برای ساخت پروفایل، اطلاعات زیر را کامل کنید." : "Complete the details below to create your profile."}</p>
        {athleteId && <p className="mb-4 text-xs text-white/60">{isFa ? "شناسه معرفی:" : "Referral ID:"} {athleteId}</p>}
        <form noValidate onSubmit={submit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label>{isFa ? "نام کامل" : "Full name"}<input name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{fieldError("name")}</label>
          <label>{isFa ? "ایمیل" : "Email"}<input name="email" type="email" autoComplete="email" dir="ltr" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{fieldError("email")}</label>
          <label>{isFa ? "رشته ورزشی" : "Sport"}<select name="sport" defaultValue="" aria-invalid={!!errors.sport} aria-describedby={errors.sport ? "sport-error" : undefined}><option value="" disabled>{isFa ? "انتخاب کنید" : "Select one"}</option><option value="football">{isFa ? "فوتبال" : "Football"}</option><option value="wrestling">{isFa ? "کشتی" : "Wrestling"}</option><option value="volleyball">{isFa ? "والیبال" : "Volleyball"}</option><option value="other">{isFa ? "سایر" : "Other"}</option></select>{fieldError("sport")}</label>
          <label>{isFa ? "سن" : "Age"}<input name="age" type="number" min="16" max="60" inputMode="numeric" aria-invalid={!!errors.age} aria-describedby={errors.age ? "age-error" : undefined} />{fieldError("age")}</label>
          <label className="md:col-span-2">{isFa ? "سوابق و هدف ورزشی" : "Background and athletic goal"}<textarea name="bio" rows={5} aria-invalid={!!errors.bio} aria-describedby={errors.bio ? "bio-error" : undefined} />{fieldError("bio")}</label>
          <button type="submit" className="btn btn-primary md:col-span-2">{isFa ? "ارسال درخواست" : "Submit application"}</button>
        </form>
      </div>
    </main>
  );
}
