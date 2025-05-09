"use client";

import { cn } from "@/util/cn";
import { useFieldContext } from "@/util/formContext";

type TextAreaProps = {
  label: string;
  placeholder?: string;
  className?: string;
  errorsClassName?: string;
  labelClassName?: string;
  rows?: number;
};

export default function TextArea({
  label,
  placeholder,
  className,
  errorsClassName,
  labelClassName,
  rows = 6,
}: TextAreaProps) {
  const field = useFieldContext<string>();

  return (
    <div>
      <label htmlFor={field.name} className={cn("block text-m font-medium mb-1", labelClassName)}>
        {label}
      </label>
      <textarea
        id={field.name}
        name={field.name}
        placeholder={placeholder}
        rows={rows}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(
          "w-full px-3 py-2 border rounded-md resize-none",
          field.state.meta.errors.length > 0 ? "border-red-500" : "border-gray-300",
          className,
        )}
      />
      <div className={cn("min-h-5 mt-1 text-red-500 text-sm [&>*]:not-last:mr-2", errorsClassName)}>
        {field.state.meta.errors.length > 0 &&
          field.state.meta.errors.map((error) => <span key={error.validation + error.message}>{error.message}</span>)}
      </div>
    </div>
  );
}
