"use client";

import { cn } from "@/util/cn";
import { useFieldContext } from "@/util/formContext";

type InputProps = {
  label: string;
  placeholder?: string;
  className?: string;
  errorsClassName?: string;
  labelClassName?: string;
};

export default function NumberInput({ label, placeholder, className, errorsClassName, labelClassName }: InputProps) {
  const field = useFieldContext<number>();

  return (
    <div>
      <label htmlFor={field.name} className={cn("block text-m font-medium mb-1", labelClassName)}>
        {label}
      </label>
      <div className="relative">
        <input
          id={field.name}
          name={field.name}
          type="number"
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
          className={cn(
            "w-full px-3 py-2 border rounded-md pr-10",
            field.state.meta.errors.length > 0 ? "border-red-500" : "border-gray-300",
            className,
          )}
        />
      </div>
      <div className={cn("h-2 mt-1 text-red-500 text-sm", errorsClassName)}>
        {field.state.meta.errors.length > 0 && <span>{field.state.meta.errors.join(", ")}</span>}
      </div>
    </div>
  );
}
