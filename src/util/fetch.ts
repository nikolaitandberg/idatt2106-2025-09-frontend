import { ApiError } from "@/types/apiResponses";
import { signOut, useSession } from "next-auth/react";
import { auth } from "./auth";
import { Token } from "@/types";

export type FetchFunction = <T>(input: string | URL | globalThis.Request, init?: RequestInit) => Promise<T | null>;

/**
 * Sends a fetch request with the token in the Authorization header.
 * NOTE: This function is only ever meant to be used on server-side.
 * It will not work on the client-side.
 */
export const Fetch: FetchFunction = async <T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<T | null> => {
  return await FetchParse<T>(input, init, await auth());
};
export default Fetch;

/**
 * Sends a fetch request with the token in the Authorization header.
 * @param input
 * @param init
 * @param session
 * @returns
 */
export async function FetchParse<T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
  session?: Token | null,
) {
  const res = await FetchWithoutParse(input, init, session);

  if (!res.ok) {
    if (res.status === 401) {
      // The user is not authenticated, ensure that the auth state is updated
      signOut();
      throw new ApiError("Unauthorized", res.status);
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

export async function FetchWithoutParse(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
  session?: Token | null,
) {
  const headers = new Headers(init?.headers);

  if (session) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  return await fetch(input, {
    ...(init || {}),
    headers: headers,
  });
}

/**
 * Returns a function that can be used to fetch data with the token in the Authorization header.
 * @param input
 * @param init
 * @returns
 */
export function useFetch() {
  const session = useSession();

  const fetcher: FetchFunction = async <T>(input: string | URL | globalThis.Request, init?: RequestInit) => {
    return await FetchParse<T>(input, init, session.data);
  };

  return fetcher;
}
