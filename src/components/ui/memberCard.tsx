"use client";

import Image from "next/image";
import { Dog, X } from "lucide-react";

type MemberCardProps = {
  name: string;
  image?: string;
  type?: "person" | "animal" | "child";
  onRemove?: () => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function MemberCard({ name, image, type = "person", onRemove }: MemberCardProps) {
  const initials = getInitials(name);

  let avatarContent;

  if (image) {
    avatarContent = (
      <Image src={image} alt={name} width={40} height={40} className="object-cover w-full h-full rounded-full" />
    );
  } else if (type === "animal") {
    avatarContent = <Dog className="w-4 h-4 text-foreground" />;
  } else {
    avatarContent = initials;
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-lg shadow-sm bg-white border border-border">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground overflow-hidden">
          {avatarContent}
        </div>
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
