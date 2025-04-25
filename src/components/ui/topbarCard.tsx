import { ElementType } from "react";
import Link from "next/link";

interface TopbarCardProps {
  icon: ElementType;
  text: string;
  href: string;
}

export function TopbarCard({ icon: Icon, text, href }: TopbarCardProps) {
  return (
    <Link href={href}>
      <div className="px-4 py-2 flex items-center gap-2 hover:underline transition-colors">
        {Icon && <Icon className="w-7 h-7" />}
        <span>{text}</span>
      </div>
    </Link>
  );
}