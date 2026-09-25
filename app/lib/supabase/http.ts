import "server-only";

import type { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  sessionCookieOptions,
  type AuthSession,
} from "./auth";

export function setSessionCookies(
  response: NextResponse,
  session: AuthSession,
) {
  response.cookies.set(
    ACCESS_COOKIE,
    session.access_token,
    sessionCookieOptions(session.expires_in),
  );
  response.cookies.set(
    REFRESH_COOKIE,
    session.refresh_token,
    sessionCookieOptions(60 * 60 * 24 * 30),
  );
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", sessionCookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, "", sessionCookieOptions(0));
}
