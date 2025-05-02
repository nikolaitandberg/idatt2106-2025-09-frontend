import Link from "next/link";
import { ElementType } from "react";

interface AdminMenuCardProps {
  icon: ElementType;
  text: string;
  href: string;
}

export function AdminMenuCard({ icon: Icon, text, href }: AdminMenuCardProps) {
  return (
    <Link href={href} className="flex w-full p-4 hover:bg-accent">
      {Icon && <Icon className="w-10 h-10" />}
      <span className="ml-5 text-3xl">{text}</span>
    </Link>
  );
}
