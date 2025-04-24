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
