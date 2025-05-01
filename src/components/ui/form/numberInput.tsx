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
          value={String(field.state.value)}
          onChange={(e) => {
            if (e.target.value === "") {
              field.handleChange(0);
              return;
            }
            field.handleChange(e.target.valueAsNumber);
          }}
          className={cn(
            "w-full px-3 py-2 border rounded-md",
            field.state.meta.errors.length > 0 ? "border-red-500" : "border-gray-300",
            className,
          )}
        />
      </div>
      <div className={cn("min-h-5 mt-1 text-red-500 text-sm [&>*]:not-last:mr-2", errorsClassName)}>
        {field.state.meta.errors.length > 0 &&
          field.state.meta.errors.map((error) => <span key={error.validation + error.message}>{error.message}</span>)}
      </div>
    </div>
  );
}
