"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShieldUser, MapPin, CircleAlert, ChevronDown } from "lucide-react";
import { ElementType, useState, MouseEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/util/cn";

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
  onClick: (e: MouseEvent) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.1,
      delay: index * 0.02,
      ease: "easeOut",
    }}>
    <Link href={href} className="flex items-center gap-2 p-2 rounded hover:bg-slate-100" onClick={(e) => onClick(e)}>
      <Icon size={18} />
      <span>{text}</span>
    </Link>
  </motion.div>
);

export function AdminMenuPopover({ isSelected }: { isSelected?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<{
    timeoutId: NodeJS.Timeout;
    lastEnteredTime: number;
  } | null>(null);

  const menuItems = [
    { icon: MapPin, text: "Kart", href: "/admin/map" },
    { icon: CircleAlert, text: "Scenario", href: "/admin/scenario" },
    { icon: ShieldUser, text: "Ny admin", href: "/admin/new-admin" },
  ];

  const handleMouseEnter = () => {
    if (hoverTimeout?.timeoutId) clearTimeout(hoverTimeout.timeoutId);
    setOpen(true);
    setHoverTimeout({ timeoutId: setTimeout(() => {}, 0), lastEnteredTime: Date.now() });
  };

  const handleMouseLeave = () => {
    if (hoverTimeout?.timeoutId) clearTimeout(hoverTimeout.timeoutId);
    const timeoutId = setTimeout(() => {
      setOpen(false);
    }, 300);
    setHoverTimeout({ timeoutId, lastEnteredTime: hoverTimeout?.lastEnteredTime ?? Date.now() });
  };

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (Date.now() - (hoverTimeout?.lastEnteredTime || 0) < 350) {
          return;
        }
        if (!open && hoverTimeout?.timeoutId) {
          clearTimeout(hoverTimeout.timeoutId);
        }
        setOpen(open);
      }}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger className="flex items-center hover:underline hover:cursor-pointer">
          <div className="flex flex-col md:flex-row items-center gap-1">
            <ShieldUser className="md:w-7 md:h-7" />
            <span className={cn("transition-all duration-200", { "font-bold": isSelected })}>Admin</span>
          </div>
          <ChevronDown
            className={`ml-1 w-4 h-4 transition-transform duration-200 hidden md:flex ${open ? "rotate-180" : ""}`}
          />
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0 overflow-hidden bg-white shadow-xl" sideOffset={8} asChild>
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
      </div>
    </Popover>
  );
}
