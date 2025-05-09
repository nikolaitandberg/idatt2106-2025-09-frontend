import { useProfile } from "@/actions/user";
import { Settings } from "@/types/setting";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useMemo } from "react";

const settingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const session = useSession();
  const profile = useProfile(session.data?.user.userId ?? 0, {
    enabled: !!session.data?.user.userId,
  });

  const settings: Settings = useMemo(
    () => ({
      sharePositionHousehold: profile.data?.sharePositionHousehold ?? false,
      sharePositionHouseholdGroup: profile.data?.sharePositionGroup ?? false,
    }),
    [profile.data],
  );

  return <settingsContext.Provider value={settings}>{children}</settingsContext.Provider>;
}

export default function useSettings() {
  const context = useContext(settingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
