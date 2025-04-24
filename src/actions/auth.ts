import { AuthProviderLoginErrorResponse, AuthProviderLoginSuccessResponse } from "@/util/authProvider";

// IMPORTANT: These functions do not use the overloaded "Fetch" function from
// /util/fetch.ts. This is because we cannot attach a "auth" header to the
// request.

export async function sendLoginRequest(
  username: string,
  password: string,
): Promise<AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorResponse: AuthProviderLoginErrorResponse = {
      success: false,
      message: "Kunne ikke logge deg inn. Prøv igjen senere",
    };
    return errorResponse;
  }

  const data = await res.json();
  return {
    success: true,
    token: data.token,
  };
}

export async function sendRegisterRequest(
  username: string,
  password: string,
): Promise<AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorResponse: AuthProviderLoginErrorResponse = {
      success: false,
      message: "Kunne ikke logge deg inn. Prøv igjen senere",
    };
    return errorResponse;
  }

  const data = await res.json();
  return {
    success: true,
    token: data.token,
  };
}
