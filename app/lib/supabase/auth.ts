import "server-only";

import { getSupabaseConfig } from "./config";

export const ACCESS_COOKIE = "taliva-access-token";
export const REFRESH_COOKIE = "taliva-refresh-token";

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
    locale?: "fa" | "en";
  };
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
};

type AuthError = {
  error?: string;
  error_code?: string;
  error_description?: string;
  msg?: string;
  message?: string;
};

export class SupabaseAuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SupabaseAuthError";
    this.status = status;
  }
}

async function authRequest<T>(
  path: string,
  init: RequestInit,
  accessToken?: string,
): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new SupabaseAuthError(503, "Database authentication is not configured.");
  }

  const response = await fetch(`${config.url}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: config.publishableKey,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as T & AuthError;

  if (!response.ok) {
    throw new SupabaseAuthError(
      response.status,
      payload.message ??
        payload.msg ??
        payload.error_description ??
        payload.error ??
        "Authentication failed.",
    );
  }

  return payload;
}

export function signUpWithPassword(input: {
  email: string;
  password: string;
  displayName: string;
  locale: "fa" | "en";
}) {
  return authRequest<AuthSession | { user: AuthUser; session: null }>("/signup", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      data: {
        display_name: input.displayName,
        locale: input.locale,
      },
    }),
  });
}

export function signInWithPassword(email: string, password: string) {
  return authRequest<AuthSession>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function refreshSession(refreshToken: string) {
  return authRequest<AuthSession>("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export function getAuthUser(accessToken: string) {
  return authRequest<AuthUser>("/user", { method: "GET" }, accessToken);
}

export async function revokeSession(accessToken: string) {
  await authRequest<Record<string, never>>(
    "/logout",
    { method: "POST" },
    accessToken,
  );
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
