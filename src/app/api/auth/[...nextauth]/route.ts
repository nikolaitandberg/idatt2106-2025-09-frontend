// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { sendLoginRequest } from "@/actions/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { Token } from "@/types";
import { API_BASE_URL } from "@/types/constants";

const decodeToken = (token: string) => {
  const decodedToken = jwtDecode<Token>(token);
  return {
    userId: decodedToken.userId,
    isAdmin: decodedToken.isAdmin,
    isSuperAdmin: decodedToken.isSuperAdmin,
    token: token,
    refreshToken: decodedToken.refreshToken,
    sub: decodedToken.sub,
    iat: decodedToken.iat,
    exp: decodedToken.exp,
  };
};

const verifyToken = async (token: string) => {
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

const handler = NextAuth({
  debug: true,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const res = await sendLoginRequest(credentials?.username || "", credentials?.password || "");
        if (res.success) {
          return decodeToken(res.token);
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "token",
      name: "Token",
      credentials: {
        token: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          return null;
        }

        if (!(await verifyToken(credentials.token))) {
          return null;
        }
        return decodeToken(credentials?.token);
      },
    }),
  ],
  pages: {},
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          userId: user.userId,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        };
        token.token = user.token;
        token.refreshToken = user.refreshToken;
        token.sub = user.sub;
        token.iat = user.iat;
        token.exp = user.exp;
      }
      return token;
    },
    async session({ token }) {
      return {
        user: token.user,
        token: token.token,
        refreshToken: token.refreshToken,
        sub: token.sub,
        iat: token.iat,
        exp: token.exp,
      };
    },
  },
});

export { handler as GET, handler as POST };
