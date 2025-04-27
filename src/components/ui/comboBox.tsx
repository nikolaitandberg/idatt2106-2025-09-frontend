import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scrollArea";

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
          className="w-full flex flex-col max-h-60"
          style={{ width: "var(--radix-popover-trigger-width)", overscrollBehavior: "contain" }}>
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedOption(option);
                onSelect(option);
                setOpen(false);
              }}
              className="w-full cursor-pointer p-2">
              {renderOption(option)}
            </button>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
