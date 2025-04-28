// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { config } from "@/util/auth";
import NextAuth from "next-auth";

const handler = NextAuth(config);

export { handler as GET, handler as POST };
