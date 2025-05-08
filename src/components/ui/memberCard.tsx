"use client";

import { X } from "lucide-react";
import UserAvatar from "./UserAvatar";

type MemberCardProps = {
  name: string;
  image?: string;
  type?: "person" | "animal" | "child";
  onRemove?: () => void;
};

export default function MemberCard({ name, image, type = "person", onRemove }: MemberCardProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg shadow-sm bg-white border border-border">
      <div className="flex items-center gap-3">
        <UserAvatar name={name} image={image} type={type} />
        <span className="text-sm text-foreground">{name}</span>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function MemberCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg shadow-sm bg-white border border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
        <span className="animate-pulse bg-muted rounded w-30 h-5" />
      </div>
    </div>
  );
}
