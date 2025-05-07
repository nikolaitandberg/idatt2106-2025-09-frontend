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
 * @param recaptchaToken The recaptcha token
 * @returns A promise that resolves to a RegisterResponse
 */
export async function sendRegisterRequest(
  email: string,
  username: string,
  password: string,
  recaptchaToken: string,
): Promise<RegisterSuccessRespnse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password, recaptchaToken }),
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

/**
 * Verifies a token by sending a request to the backend
 *
 * @param token The token to verify
 * @returns true if the token is valid, false otherwise
 */
export const verifyToken = async (token: string) => {
  console.log("Verifying token");
  try {
    const res = await fetch(`${API_BASE_URL}/auth/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
