"use client";

import { Users, Home } from "lucide-react";

type GroupCardProps = {
  name: string;
  households: number;
  members: number;
};

export default function GroupCard({ name, households, members }: GroupCardProps) {
  return (
    <div className="rounded-lg border border-border shadow-sm bg-white p-4 space-y-2 text-sm">
      <h3 className="text-base font-semibold">{name}</h3>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Home className="w-4 h-4" />
        <span>{households} husholdninger</span>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{members} medlemmer</span>
      </div>
    </div>
  );
}
