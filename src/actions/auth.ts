import { LoginErrorResponse, LoginSuccessResponse, RegisterSuccessRespnse } from "@/types";
import { ApiError } from "@/types/apiResponses";
import { API_BASE_URL } from "@/types/constants";
// IMPORTANT: These functions do not use the overloaded "Fetch" function from
// /util/fetch.ts. This is because we cannot attach a "auth" header to the
// request.

export async function sendLoginRequest(
  username: string,
  password: string,
): Promise<LoginSuccessResponse | LoginErrorResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorResponse: LoginErrorResponse = {
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
/**
 * Send a register request to the server
 * @param email The email of the user
 * @param username The username of the user
 * @param password The password of the user
 * @returns A promise that resolves to a RegisterResponse
 */
export async function sendRegisterRequest(
  email: string,
  username: string,
  password: string,
): Promise<RegisterSuccessRespnse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) {
    const errorMessage = await res.text();

    const errorResponse: LoginErrorResponse = {
      success: false,
      message: errorMessage ?? "Kunne ikke registrere deg. Prøv igjen senere",
    };
    throw new ApiError(errorResponse.message);
  }

  const data = await res.json();
  return {
    token: data.token,
  };
}
