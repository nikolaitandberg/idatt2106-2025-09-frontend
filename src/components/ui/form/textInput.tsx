"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/util/cn";
import { useFieldContext } from "@/util/formContext";

type InputProps = {
  label: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  className?: string;
  showPasswordClassName?: string;
  errorsClassName?: string;
  labelClassName?: string;
  toggleVisibilityButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export default function TextInput({
  label,
  type = "text",
  placeholder,
  className,
  showPasswordClassName,
  errorsClassName,
  labelClassName,
  toggleVisibilityButtonProps,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const field = useFieldContext<string>();

  return (
    <div>
      <label htmlFor={field.name} className={cn("block text-m font-medium mb-1", labelClassName)}>
        {label}
      </label>
      <div className="relative">
        <input
          id={field.name}
          name={field.name}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2 border rounded-md pr-10",
            field.state.meta.errors.length > 0 ? "border-red-500" : "border-gray-300",
            className,
          )}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer",
              showPasswordClassName,
            )}
            tabIndex={0}
            {...toggleVisibilityButtonProps}
            >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <div className={cn("min-h-5 mt-1 text-red-500 text-sm [&>*]:not-last:mr-2", errorsClassName)}>
        {field.state.meta.errors.length > 0 &&
          field.state.meta.errors.map((error) => <span key={error.validation + error.message}>{error.message}</span>)}
      </div>
    </div>
  );
}
