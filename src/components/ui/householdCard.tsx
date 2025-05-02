"use client";

import { MapPin } from "lucide-react";
import { HouseholdGroupMember } from "@/types/household";

export default function HouseholdCard({
  name = "Husholdning",
  address,
  peopleCount,
  petCount = 0,
  isHome = false,
}: HouseholdGroupMember) {
  return (
    <div className="rounded-lg border p-4 w-[280px] bg-muted/30">
      <h3 className="text-lg font-medium flex items-center justify-between">
        {name}
        {isHome && (
          <span className="text-xs text-white bg-muted px-2 py-0.5 text-foreground rounded-full bg-primary">
            Ditt hjem
          </span>
        )}
      </h3>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        <span>{address}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {peopleCount} person{peopleCount !== 1 ? "er" : ""}
        {petCount > 0 ? `, ${petCount} dyr` : ""}
      </p>
    </div>
  );
}