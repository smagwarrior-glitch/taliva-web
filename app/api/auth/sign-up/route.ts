import { NextResponse } from "next/server";
import {
  signUpWithPassword,
  SupabaseAuthError,
  type AuthSession,
} from "@/app/lib/supabase/auth";
import { setSessionCookies } from "@/app/lib/supabase/http";

type SignUpBody = {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
  locale?: unknown;
};

function isSession(value: unknown): value is AuthSession {
  return Boolean(
    value &&
      typeof value === "object" &&
      "access_token" in value &&
      "refresh_token" in value,
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SignUpBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  const locale = body.locale === "fa" ? "fa" : "en";

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (displayName.length < 2 || displayName.length > 80) {
    return NextResponse.json({ error: "Display name must be between 2 and 80 characters." }, { status: 400 });
  }

  try {
    const result = await signUpWithPassword({
      email,
      password,
      displayName,
      locale,
    });
    const response = NextResponse.json({
      ok: true,
      confirmationRequired: !isSession(result),
    });

    if (isSession(result)) setSessionCookies(response, result);

    return response;
  } catch (error) {
    const status = error instanceof SupabaseAuthError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unable to create account.";
    return NextResponse.json({ error: message }, { status });
  }
}
