"use client";

import { MapPin } from "lucide-react";
import { HouseholdGroupMember } from "@/types/household";
import { Users } from "lucide-react";


export default function HouseholdCard({
  name = "Husholdning",
  address,
  peopleCount,
  petCount = 0,
  isHome = false,
}: HouseholdGroupMember) {
  return (
    <div className="rounded-lg border border-border shadow-sm p-4 w-[280px] bg-white">
      <h3 className="text-lg font-medium flex items-center justify-between">
        {name}
        {isHome && (
          <span className="text-xs text-white bg-muted px-2 py-0.5 text-foreground rounded-full bg-primary">
            Ditt hjem
          </span>
        )}
      </h3>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 mb-1">
        <MapPin className="w-3.5 h-3.5 inline-block mr-1" />
        <span>{address}</span>
      </div>
      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="w-3.5 h-3.5 inline-block mr-1" />
        {peopleCount} medlem{peopleCount !== 1 ? "mer" : ""}
        {petCount > 0 ? `, ${petCount} dyr` : ""}
      </p>
    </div>
  );
}