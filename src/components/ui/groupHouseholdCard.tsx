"use client";

import { useHousehold, useHouseholdUsers } from "@/actions/household";
import HouseholdCard from "@/components/ui/householdCard";

interface GroupHouseholdCardProps {
  householdId: number;
  isHome?: boolean;
}

export default function GroupHouseholdCard({ householdId, isHome }: GroupHouseholdCardProps) {
  const { data: household } = useHousehold(householdId);
  const { data: users } = useHouseholdUsers(householdId);

  const memberCount = users?.length ?? 0;

  return (
    <HouseholdCard
      id={householdId}
      name="Husholdning"
      address={household?.address ?? ""}
      peopleCount={memberCount}
      isHome={isHome}
    />
  );
}
