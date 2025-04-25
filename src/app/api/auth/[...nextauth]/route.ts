// @ts-nocheck
import { sendLoginRequest } from "@/actions/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const res = await sendLoginRequest(credentials?.username || "", credentials?.password || "");
        if (res.success) {
          const decodedToken = jwtDecode<any>(res.token);
          return {
            userId: decodedToken.userId,
            isAdmin: decodedToken.isAdmin,
            isSuperAdmin: decodedToken.isSuperAdmin,
            token: res.token,
            refreshToken: decodedToken.refreshToken,
            sub: decodedToken.sub,
            iat: decodedToken.iat,
            exp: decodedToken.exp,
          };
        }
        return null;
      },
    }),
    //TODO: add register provider
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
    async session({ session, token }) {
      // Return only the custom session object
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
