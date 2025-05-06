"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShieldUser, MapPin, CircleAlert, Newspaper } from "lucide-react";
import { ElementType, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const AdminMenuItem = ({
  icon: Icon,
  text,
  href,
  index,
  onClick,
}: {
  icon: ElementType;
  text: string;
  href: string;
  index: number;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.1,
      delay: index * 0.02,
      ease: "easeOut",
    }}>
    <Link href={href} className="flex items-center gap-2 p-2 rounded hover:bg-slate-100" onClick={onClick}>
      <Icon size={18} />
      <span>{text}</span>
    </Link>
  </motion.div>
);

export function AdminMenuPopover() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: Newspaper, text: "Nyheter", href: "/admin/news" },
    { icon: MapPin, text: "Kart", href: "/admin/map" },
    { icon: CircleAlert, text: "Scenario", href: "/admin/scenario" },
    { icon: ShieldUser, text: "Ny admin", href: "/admin/new-admin" },
  ];

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center hover:underline hover:cursor-pointer group px-4 py-2">
        <ShieldUser className="w-7 h-7" />
        <span className="ml-2 transition-all duration-200">Admin</span>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 overflow-hidden" sideOffset={8} asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.1,
            },
          }}
          className="p-2 space-y-1">
          {menuItems.map((item, index) => (
            <AdminMenuItem
              key={item.href}
              icon={item.icon}
              text={item.text}
              href={item.href}
              index={index}
              onClick={handleItemClick}
            />
          ))}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
