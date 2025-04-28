"use client";

import { CalendarIcon } from "lucide-react";

import { cn } from "@/util/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface DatePickerProps {
  initialDate?: Date;
  label?: string;
  onDateChange?: (date: Date | undefined) => void;
}

export function DatePicker({ initialDate, label, onDateChange }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate);

  useEffect(() => {
    onDateChange?.(date);
  }, [date, onDateChange]);

  return (
    <Popover>
      <label className="text-base font-medium mb-1">{label ?? "Dato"}</label>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start gap-2 text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Velg en dato</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
