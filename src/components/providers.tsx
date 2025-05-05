"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "./settingsProvider";
import { SocketProvider } from "./socketProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SocketProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </SocketProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
