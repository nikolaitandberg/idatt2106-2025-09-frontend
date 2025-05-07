import { ElementType } from "react";
import Link from "next/link";
import { cn } from "@/util/cn";

interface TopbarCardProps {
  icon: ElementType;
  text: string;
  href: string;
  isSelected?: boolean;
}

export function TopbarCard({ icon: Icon, text, href, isSelected }: TopbarCardProps) {
  return (
    <Link href={href}>
      <div className="relative flex flex-col md:flex-row items-center gap-1 hover:underline transition-colors">
        {Icon && <Icon className="md:w-7 md:h-7" />}
        <div className="relative">
          <span className="invisible font-bold text-sm md:text-base">{text}</span>
          <span
            className={cn("absolute inset-0 flex items-center justify-center text-sm md:text-base hover:underline ", {
              "font-bold": isSelected,
              "font-normal": !isSelected,
            })}>
            {text}
          </span>
        </div>
      </div>
    </Link>
  );
}
