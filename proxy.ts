import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "taliva-access-token";
const REFRESH_COOKIE = "taliva-refresh-token";

type SessionPayload = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return url && key ? { url, key } : null;
}

function setSessionCookies(response: NextResponse, session: SessionPayload) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  response.cookies.set(ACCESS_COOKIE, session.access_token, {
    ...options,
    maxAge: session.expires_in,
  });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    ...options,
    maxAge: 60 * 60 * 24 * 30,
  });
}

function clearSessionCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  response.cookies.set(ACCESS_COOKIE, "", options);
  response.cookies.set(REFRESH_COOKIE, "", options);
}

async function accessTokenIsValid(url: string, key: string, token: string) {
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return response.ok;
}

async function refreshAccessToken(
  url: string,
  key: string,
  refreshToken: string,
): Promise<SessionPayload | null> {
  const response = await fetch(
    `${url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    },
  );

  if (!response.ok) return null;
  return (await response.json()) as SessionPayload;
}

export async function proxy(request: NextRequest) {
  const supabase = config();

  // Until project keys are configured, keep the existing demo dashboard available.
  if (!supabase) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let authenticated =
    Boolean(accessToken) &&
    (await accessTokenIsValid(supabase.url, supabase.key, accessToken!));
  let refreshedSession: SessionPayload | null = null;

  if (!authenticated && refreshToken) {
    refreshedSession = await refreshAccessToken(
      supabase.url,
      supabase.key,
      refreshToken,
    );
    authenticated = Boolean(refreshedSession);
  }

  const isProtected = request.nextUrl.pathname.startsWith("/investor/dashboard");
  const isAuthPage = request.nextUrl.pathname === "/auth";

  let response: NextResponse;

  if (isProtected && !authenticated) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set(
      "returnTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    loginUrl.searchParams.set(
      "lang",
      request.nextUrl.searchParams.get("lang") === "fa" ? "fa" : "en",
    );
    response = NextResponse.redirect(loginUrl);
  } else if (isAuthPage && authenticated) {
    const dashboardUrl = new URL("/investor/dashboard", request.url);
    dashboardUrl.searchParams.set(
      "lang",
      request.nextUrl.searchParams.get("lang") === "fa" ? "fa" : "en",
    );
    response = NextResponse.redirect(dashboardUrl);
  } else {
    response = NextResponse.next();
  }

  if (refreshedSession) {
    setSessionCookies(response, refreshedSession);
  } else if (!authenticated && (accessToken || refreshToken)) {
    clearSessionCookies(response);
  }

  return response;
}

export const config = {
  matcher: ["/auth", "/investor/dashboard/:path*"],
};
