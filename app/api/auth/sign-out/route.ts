import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  revokeSession,
} from "@/app/lib/supabase/auth";
import { clearSessionCookies } from "@/app/lib/supabase/http";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (accessToken) {
    await revokeSession(accessToken).catch(() => undefined);
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}
