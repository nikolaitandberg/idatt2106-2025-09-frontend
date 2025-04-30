"use client";

import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/util/cn";
import type { JSX } from "react";

export type ToastVariant = "default" | "success" | "error" | "info" | "warning";

export interface CustomToastProps {
  title: string;
  description: string;
  variant?: ToastVariant;
  button?: {
    label: string;
    onClick: () => void;
  };
}

const variantIcons: Record<ToastVariant, JSX.Element> = {
  default: <Info className="text-gray-500" size={20} />,
  success: <CheckCircle className="text-green-600" size={20} />,
  error: <XCircle className="text-red-600" size={20} />,
  info: <Info className="text-blue-600" size={20} />,
  warning: <AlertTriangle className="text-yellow-600" size={20} />,
};

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-white text-gray-900 border border-gray-200",
  success: "bg-green-100 text-green-900 border border-green-300",
  error: "bg-red-100 text-red-900 border border-red-300",
  info: "bg-blue-100 text-blue-900 border border-blue-300",
  warning: "bg-yellow-100 text-yellow-900 border border-yellow-300",
};

export function CustomToast({
  title,
  description,
  variant = "default",
  button,
}: CustomToastProps & { id: string | number }) {
  return (
    <div
      className={cn(
        "relative flex w-full min-w-xs max-w-md items-start justify-between gap-4 rounded-lg p-4 shadow-sm",
        variantStyles[variant],
      )}>
      <button onClick={() => sonnerToast.dismiss()} className="absolute top-2 right-2 text-gray-500 hover:text-black">
        <X size={16} />
      </button>

      <div className="flex items-center gap-3 flex-1 pr-6">
        {variantIcons[variant]}
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm">{description}</p>
        </div>
      </div>

      {button && (
        <button
          onClick={button.onClick}
          className="ml-4 rounded bg-white px-3 py-1 text-sm font-semibold border hover:bg-gray-50">
          {button.label}
        </button>
      )}
    </div>
  );
}

export function showToast({ title, description, variant = "default", button }: Omit<CustomToastProps, "id">) {
  return sonnerToast.custom(
    (id) => <CustomToast id={id} title={title} description={description} variant={variant} button={button} />,
    {
      duration: 7000,
    },
  );
}
