"use client";

import { AuthClient } from "@/util/authClient";
import { AuthProvider } from "@/util/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const authClient = new AuthClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider client={authClient}>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
