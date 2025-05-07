"use client";

import Link from "next/link";
import { Users, Home } from "lucide-react";

type GroupCardProps = {
  id: number;
  name: string;
  households: number;
  members: number;
};

export default function GroupCard({ id, name, households, members }: GroupCardProps) {
  return (
    <Link href={`/group/${id}`} className="block">
      <div className="rounded-lg border border-border shadow-sm bg-white p-4 space-y-2 text-sm hover:shadow-lg transition-shadow">
        <h3 className="text-base font-semibold">{name}</h3>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>
            {households} {households === 1 ? "husholdning" : "husholdninger"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {members} {members === 1 ? "medlem" : "medlemmer"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="rounded-lg border border-border shadow-sm bg-white p-4 pt-4 space-y-2 text-sm animate-pulse">
      <div className="h-6 bg-muted rounded w-full" />
      <div className="flex items-center gap-2 text-muted-foreground">
        <Home className="w-4 h-4" />
        <div className="h-5 bg-muted rounded w-1/2" />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4" />
        <div className="h-5 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}
