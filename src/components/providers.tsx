"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "./settingsProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
