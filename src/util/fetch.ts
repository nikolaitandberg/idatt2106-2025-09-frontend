import { ApiError } from "@/types/apiResponses";
import { signOut, useSession } from "next-auth/react";
import { auth } from "./auth";
import { Token } from "@/types";
import { verifyToken } from "@/actions/auth";
import { redirect } from "next/navigation";

/**
 * A function that can be used to fetch data with the token in the Authorization header.
 */
export type FetchFunction = <T>(input: string | URL | globalThis.Request, init?: RequestInit) => Promise<T>;

/**
 * Sends a fetch request with the token in the Authorization header.
 * NOTE: This function is only ever meant to be used on server-side.
 * It will not work on the client-side.
 */
export const Fetch: FetchFunction = async <T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<T> => {
  return await FetchParse<T>(input, init, await auth());
};
export default Fetch;

async function extractResponseContent<T>(res: Response): Promise<T> {
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

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
    if (res.status === 401 || res.status === 403) {
      // check if the token is valid
      if (!(await verifyToken(session?.token ?? ""))) {
        // if the token is not valid, sign out the user
        if (typeof window !== "undefined") {
          signOut({ redirect: false });
        } else {
          redirect("/login");
        }
      }

      throw new ApiError("Unauthorized", res.status);
    }

    if (res.status === 404) {
      throw new ApiError("Not found", res.status);
    }

    const err = await extractResponseContent<{ error: string }>(res);
    throw new ApiError(err?.error ?? "Noe gikk galt", res.status);
  }

  if (res.status === 204) {
    return null as T;
  }

  return extractResponseContent<T>(res);
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
 * Returns a function that can be used on the client-side to fetch data with the token in the Authorization header.
 */
export function useFetch() {
  const session = useSession();

  const fetcher: FetchFunction = async <T>(input: string | URL | globalThis.Request, init?: RequestInit) => {
    return await FetchParse<T>(input, init, session.data);
  };

  return fetcher;
}
