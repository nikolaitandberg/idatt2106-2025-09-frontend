import { Token } from "@/types";
import { AuthProviderClient, AuthProviderLoginErrorResponse, AuthProviderLoginSuccessResponse } from "./authProvider";
import { jwtDecode } from "jwt-decode";
import { sendLoginRequest, sendRegisterRequest } from "@/actions/auth";

/**
 * A authenticaion client that handles all authentication logic and state management.
 * It is used to log in, register, and log out users. It also handles token verification
 * and storage.
 */
export class AuthClient implements AuthProviderClient {
  isAuthenticated: boolean;
  token: Token | null;
  rawToken: string | null;

  constructor() {
    this.isAuthenticated = false;
    this.token = null;
    this.rawToken = null;
  }

  /**
   * Attempts to log a user in and updates the authentication state
   * @param username the username of the user
   * @param password the password of the user
   * @returns {AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse}
   */
  public async login(
    username: string,
    password: string,
  ): Promise<AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse> {
    const res = await sendLoginRequest(username, password);

    if (res.success) {
      this.isAuthenticated = true;
      this.rawToken = res.token;
      this.token = jwtDecode<Token>(res.token);
    }

    return res;
  }

  /**
   * Registers a new user and updates the authentication state
   * @param username the username of the user
   * @param password the password of the user
   * @returns
   */
  public async register(
    username: string,
    password: string,
  ): Promise<AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse> {
    const res = await sendRegisterRequest(username, password);

    if (res.success) {
      this.isAuthenticated = true;
      this.rawToken = res.token;
      this.token = jwtDecode<Token>(res.token);
    }

    return res;
  }

  /**
   * Gets and verifies authentcation status. This function should be used instead of checking
   * the isAuthenticated property directly, as it will also verify the token validity.
   */
  public userIsAuthenticated() {
    this.verifyTokenValidity();
    return this.isAuthenticated;
  }

  /**
   * Verifies and updates token validity. This function should be called every time
   * the user tries to access a protected route or perform an action that requires
   * authentication.
   */
  public verifyTokenValidity() {
    // If token is not set, ensure that the user is logged out
    if (!this.token) {
      this.logout();
      return;
    }

    // If token is expired, log out the user
    const currentTime = Math.floor(Date.now() / 1000);
    if (this.token.exp < currentTime) {
      this.logout();
    }

    // Do more checks here if needed, or even refresh the token if that gets implemented
    // in the backend.
  }

  /**
   * Logs a user out, clearing the authentication state
   */
  public logout() {
    this.resetAuthenticationState();
  }

  /**
   * Resets the authentication state
   */
  private resetAuthenticationState() {
    this.isAuthenticated = false;
    this.token = null;
    this.rawToken = null;
    localStorage.removeItem("token");
  }
}
