import { ApiError } from "@/types/apiResponses";
import { signOut, useSession } from "next-auth/react";

/**
 * Sends a fetch request with the token in the Authorization header
 */
export default async function Fetch(input: string | URL | globalThis.Request, init?: RequestInit) {
  const res = await FetchWithoutParse(input, init);

  if (!res.ok) {
    if (res.status === 401) {
      // The user is not authenticated, ensure that the auth state is updated
      signOut();
      return;
    }

    const err = await res.json();
    console.log(err);
    throw new ApiError(err.error);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function FetchWithoutParse(input: string | URL | globalThis.Request, init?: RequestInit) {
  const auth = useSession();

  const headers = new Headers(init?.headers);

  if (auth.data) {
    headers.set("Authorization", `Bearer ${auth.data.token}`);
  }

  return await fetch(input, {
    ...(init || {}),
    headers: headers,
  });
}
