/**
 * JWT Token
 */
export type Token = {
  user: {
    userId: number;
    isAdmin: boolean;
    isSuperAdmin: boolean;
  };
  token: string;
  refreshToken: string;
  sub: string;
  iat: number;
  exp: number;
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

/**
 * Success response from the Auth action when logging in
 */
export type RegisterSuccessRespnse = {
  token: string;
};
