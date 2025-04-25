import { ApiError } from "@/types/apiResponses";
import { getSession, signOut } from "next-auth/react";

/**
 * Sends a fetch request with the token in the Authorization header
 */
export default async function Fetch<T>(input: string | URL | globalThis.Request, init?: RequestInit) {
  const res = await FetchWithoutParse(input, init);

  if (!res.ok) {
    if (res.status === 401) {
      // The user is not authenticated, ensure that the auth state is updated
      signOut();
      return;
    }

    if (res.status === 404) {
      throw new ApiError("Not found", res.status);
    }

    const err = await res.json();
    throw new ApiError(err.error, res.status);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json() as T;
}

export async function FetchWithoutParse(input: string | URL | globalThis.Request, init?: RequestInit) {
  const session = await getSession();
  const headers = new Headers(init?.headers);

  if (session) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  return await fetch(input, {
    ...(init || {}),
    headers: headers,
  });
}
