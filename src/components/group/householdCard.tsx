"use client";

import { MapPin, Users } from "lucide-react";
import { HouseholdGroupMember } from "@/types/household";
import { useHouseholdUsers, useExtraResidents } from "@/actions/household";

export default function HouseholdCard({ id, name, address, isHome = false }: HouseholdGroupMember) {
  const { data: users = [] } = useHouseholdUsers(id);
  const { data: extraResidents = [] } = useExtraResidents();

  const totalMembers = (users?.length ?? 0) + (extraResidents?.filter((r) => r.householdId === id).length ?? 0);

  return (
    <div className="rounded-lg border border-border shadow-sm p-4 w-[280px] bg-white">
      <h3 className="text-lg font-medium flex items-center justify-between">
        {name}
        {isHome && <span className="text-xs text-white px-2 py-0.5 rounded-full bg-primary">Ditt hjem</span>}
      </h3>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 mb-1">
        <MapPin className="w-3.5 h-3.5 inline-block mr-1" />
        <span>{address}</span>
      </div>
      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="w-3.5 h-3.5 inline-block mr-1" />
        {`${totalMembers} medlem${totalMembers !== 1 ? "mer" : ""}`}
      </p>
    </div>
  );
}

export function HouseholdCardSkeleton() {
  return (
    <div className="rounded-lg border border-border shadow-sm p-4 w-[280px] bg-white">
      <h3 className="text-lg font-medium flex items-center justify-between">
        <span className="animate-pulse bg-gray-200 h-7 w-1/2 rounded" />
        <span className="animate-pulse bg-gray-200 h-5 w-1/4 rounded-full" />
      </h3>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 mb-1">
        <MapPin className="w-3.5 h-3.5 inline-block mr-1 animate-pulse" />
        <span className="animate-pulse bg-gray-200 h-5 w-1/2 rounded" />
      </div>
      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="w-3.5 h-3.5 inline-block mr-1 animate-pulse" />
        <span className="animate-pulse bg-gray-200 h-5 w-1/2 rounded" />
      </p>
    </div>
  );
}
