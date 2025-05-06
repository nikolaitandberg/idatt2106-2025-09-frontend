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
      <div className="rounded-lg border border-border shadow-sm bg-white p-4 space-y-2 text-sm hover:shadow transition-shadow">
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
