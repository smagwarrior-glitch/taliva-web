import { NextResponse } from "next/server";
import {
  signInWithPassword,
  SupabaseAuthError,
} from "@/app/lib/supabase/auth";
import { setSessionCookies } from "@/app/lib/supabase/http";

type SignInBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SignInBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const session = await signInWithPassword(email, password);
    const response = NextResponse.json({ ok: true });
    setSessionCookies(response, session);
    return response;
  } catch (error) {
    const status = error instanceof SupabaseAuthError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return NextResponse.json({ error: message }, { status });
  }
}
