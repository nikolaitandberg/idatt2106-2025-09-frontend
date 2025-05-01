"use client";

import { cn } from "@/util/cn";

type ProgressBarProps = {
  value: number;
  label?: string;
  className?: string;
};

export default function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const getBarColor = (value: number) => {
    if (value <= 45) return "bg-progress-low";
    if (value <= 75) return "bg-progress-medium";
    return "bg-progress-high";
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm font-medium text-black">
          <span>{label}</span>
          <span>{clampedValue.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-10 rounded-full bg-white border border-gray-300 shadow-md overflow-hidden">
        <div
          className={cn("h-full transition-all duration-1500", getBarColor(clampedValue))}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
