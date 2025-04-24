"use client";

import { Token } from "@/types";
import { createContext, useContext, useMemo } from "react";

export interface AuthProviderClient {
  login: (
    username: string,
    password: string,
  ) => Promise<AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse>;
  register: (
    username: string,
    password: string,
  ) => Promise<AuthProviderLoginSuccessResponse | AuthProviderLoginErrorResponse>;
  logout: () => void;
  userIsAuthenticated: () => boolean;
  verifyTokenValidity: () => void;
  isAuthenticated: boolean;
  token: Token | null;
  rawToken: string | null;
}

interface AuthContext {
  client: AuthProviderClient;
}

export type AuthProviderLoginSuccessResponse = {
  success: true;
  token: string;
};

export type AuthProviderLoginErrorResponse = {
  success: false;
  message: string;
};

const AuthContext = createContext<AuthContext>({} as AuthContext);

export function AuthProvider({ client, children }: { client: AuthProviderClient; children: React.ReactNode }) {
  const contextValue = useMemo(() => ({ client }), [client.token, client.rawToken, client.isAuthenticated]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

/**
 * Hook that returns the auth client
 * @returns
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider is not used in the component tree");
  }
  return context.client;
}

/**
 * Gets the token and authentication status
 * @returns
 */
export function useToken(): Readonly<{ token: Token | null; isAuthenticated: boolean }> {
  const { token, isAuthenticated } = useAuth();
  return {
    token,
    isAuthenticated,
  };
}

/**
 * Hook that returns the login function
 */
export function useLogin() {
  const { login } = useAuth();
  return login;
}

/**
 * Hook that returns the register function
 */
export function useRegister() {
  const { register } = useAuth();
  return register;
}

/**
 * Hook that returns the logout function
 */
export function useLogout() {
  const { logout } = useAuth();
  return logout;
}
