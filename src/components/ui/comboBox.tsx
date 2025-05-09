"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scrollArea";
import { cn } from "@/util/cn";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface ComboBoxProps<T> {
  placeholder?: string;
  options: T[];
  initialValue?: T | undefined;
  value?: T | undefined;
  onSelect: (option: T) => void;
  renderOption: (option: T) => ReactNode;
  renderSelected: (option: T) => ReactNode;
}

export default function ComboBox<T>({
  placeholder,
  options,
  initialValue,
  value,
  onSelect,
  renderOption,
  renderSelected,
}: ComboBoxProps<T>) {
  const [selectedOption, setSelectedOption] = useState<T | undefined>(initialValue ?? undefined);
  const [open, setOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLButtonElement | null>(null);

  const buttonRef = (el: HTMLButtonElement | null, option: T) => {
    if (selectedOption === option) {
      setSelectedElement(el);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value);
    }
  }, [value]);

  useEffect(() => {
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: "center",
        inline: "nearest",
      });
    }
  }, [selectedElement]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full border border-neutral-300 rounded-md cursor-pointer ">
        <div className="flex items-center content-between relative">
          <Button size="fullWidth" variant="ghost">
            {selectedOption ? (
              renderSelected(selectedOption)
            ) : (
              <span className="text-gray-500">{placeholder ?? "Velg"}</span>
            )}
          </Button>
          {selectedOption && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 w-6 h-6 p-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOption(undefined);
                onSelect(undefined as unknown as T);
              }}
              type="button">
              <X strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent asChild>
        <ScrollArea
          onWheel={(e) => {
            e.stopPropagation();
          }}
          className="w-full flex flex-col max-h-60 p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}>
          {options.map((option, idx) => (
            <button
              ref={(el) => buttonRef(el, option)}
              key={idx}
              onClick={() => {
                setSelectedOption(option);
                setOpen(false);
                onSelect(option);
              }}
              className={cn(
                "w-full cursor-pointer p-4 hover:bg-secondary-foreground-muted focus-visible:bg-secondary-foreground-muted border-0 text-left",
                {
                  "bg-secondary-foreground hover:bg-secondary-foreground": selectedOption === option,
                },
              )}>
              {renderOption(option)}
            </button>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
