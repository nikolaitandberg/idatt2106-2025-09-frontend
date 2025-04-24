"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

type TextInputProps = {
  label: string;
  type?: "text" | "password";
  name: string;
  placeholder?: string;
  validate?: (value: string) => boolean;
  validationErrorMessage?: string;
};

export default function TextInput({
  label,
  type = "text",
  name,
  placeholder,
  validationErrorMessage,
  validate,
}: TextInputProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = validate ? validate(value) : true;
  const showError = touched && !isValid;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-m font-medium mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          className={clsx(
            "w-full px-3 py-2 border rounded-md pr-10",
            showError ? "border-red-500" : "border-gray-300",
          )}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      <div className="h-5 mt-1">
        {showError && (
          <p className="text-red-500 text-sm">
            {validationErrorMessage || "Ugyldig " + label.toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
}
