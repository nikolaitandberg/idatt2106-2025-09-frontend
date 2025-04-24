import { Token } from "@/types";
import { AuthProviderClient, AuthProviderLoginErrorResponse, AuthProviderLoginSuccessResponse } from "./authProvider";
import { jwtDecode } from "jwt-decode";
import { sendLoginRequest, sendRegisterRequest } from "@/actions/auth";

export class AuthClient implements AuthProviderClient {
  isAuthenticated: boolean;
  token: Token | null;
  rawToken: string | null;

  constructor() {
    this.isAuthenticated = false;
    this.token = null;
    this.rawToken = null;
  }

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

  public logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.rawToken = null;
  }
}
