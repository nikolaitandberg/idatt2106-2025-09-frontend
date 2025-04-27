"use client";

import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/util/cn";
import { ReactNode } from "react";

type AlertPops = {
  children: ReactNode;
  type?: "critical" | "warning" | "success" | "info";
};

export default function Alert({ children, type = "info" }: AlertPops) {
  const baseStyles = "rounded-lg p-4 flex items-center gap-3";
  const typeStyles = {
    critical: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    info: "bg-blue-100 text-blue-800",
  };

  let Icon = Info;
  if (type === "success") Icon = CheckCircle;
  else if (type === "info") Icon = Info;
  else if (type === "warning") Icon = AlertTriangle;
  else if (type === "critical") Icon = AlertTriangle;

  return (
    <div className={cn(baseStyles, typeStyles[type])}>
      <Icon className="w-6 h-6" />
      <p className="text-base text-black">{children && <span className="ml-1">{children}</span>}</p>
    </div>
  );
}
