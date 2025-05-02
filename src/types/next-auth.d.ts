declare module "next-auth" {
  interface Session {
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
  }

  type User = never;
}

declare module "next-auth/jwt" {
  interface JWT {
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
  }
}
