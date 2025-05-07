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
      <div className="flex flex-col md:flex-row items-center gap-1 hover:underline transition-colors">
        {Icon && <Icon className="md:w-7 md:h-7" />}
        <span className="text-sm md:text-base">{text}</span>
      </div>
    </Link>
  );
}
