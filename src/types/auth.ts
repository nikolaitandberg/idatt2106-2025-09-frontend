/**
 * JWT Token
 */
export type Token = {
  exp: number;
  iat: number;
  sub: string;
  refreshToken: string;
  userId: number;
  username: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

/**
 * Response from the Auth action when logging in
 */
export type LoginSuccessResponse = {
  success: true;
  token: string;
};

/**
 * Error response from the Auth action when logging in
 */
export type LoginErrorResponse = {
  success: false;
  message: string;
};
