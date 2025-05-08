"use client";

import { useHousehold, useHouseholdUsers, useMyHousehold } from "@/actions/household";
import HouseholdCard, { HouseholdCardSkeleton } from "@/components/group/householdCard";

interface GroupHouseholdCardProps {
  householdId: number;
}

export default function GroupHouseholdCard({ householdId }: GroupHouseholdCardProps) {
  const { data: household, isPending: householdIsPending } = useHousehold(householdId);
  const { data: users, isPending: householdUsersIsPending } = useHouseholdUsers(householdId);
  const { data: myHousehold, isPending: myHouseholdIsPending } = useMyHousehold();

  const memberCount = users?.length ?? 0;

  if (householdIsPending || householdUsersIsPending || myHouseholdIsPending) {
    return <HouseholdCardSkeleton />;
  }

  return (
    <HouseholdCard
      id={householdId}
      name={household?.name ?? "Husholdning"}
      address={household?.address ?? ""}
      peopleCount={memberCount}
      isHome={householdId === myHousehold?.id}
    />
  );
}

export function GroupHouseholdCardSkeleton() {
  return <HouseholdCardSkeleton />;
}
