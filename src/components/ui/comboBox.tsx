import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scrollArea";
import { cn } from "@/util/cn";

interface ComboBoxProps<T> {
  placeholder?: string;
  options: T[];
  initialValue?: T | null;
  onSelect: (option: T) => void;
  renderOption: (option: T) => React.ReactNode;
  renderSelected: (option: T) => React.ReactNode;
}

export default function ComboBox<T>({
  placeholder,
  options,
  initialValue,
  onSelect,
  renderOption,
  renderSelected,
}: ComboBoxProps<T>) {
  const [selectedOption, setSelectedOption] = useState<T | null>(initialValue ?? null);
  const [open, setOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLButtonElement | null>(null);

  const buttonRef = (el: HTMLButtonElement | null, option: T) => {
    if (selectedOption === option) {
      setSelectedElement(el);
    }
  };

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
      <PopoverTrigger className="w-full border border-neutral-300 rounded-md p-2 cursor-pointer">
        <div className="flex items-center">
          {selectedOption ? (
            renderSelected(selectedOption)
          ) : (
            <span className="text-gray-500">{placeholder ?? "Velg"}</span>
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
              className={cn("w-full cursor-pointer p-4 hover:bg-gray-100", {
                "bg-green-100 hover:bg-green-100": selectedOption === option,
              })}>
              {renderOption(option)}
            </button>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
