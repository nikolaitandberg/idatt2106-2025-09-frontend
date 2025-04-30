"use client";

import { CalendarIcon } from "lucide-react";

import { cn } from "@/util/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useFieldContext } from "@/util/formContext";

interface DatePickerProps {
  label?: string;
}

export default function DatePicker({ label }: DatePickerProps) {
  const field = useFieldContext<Date>();

  return (
    <Popover>
      <label className="text-base font-medium mb-1">{label ?? "Dato"}</label>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start gap-2 text-left font-normal",
            !field.state.value && "text-muted-foreground",
          )}>
          <CalendarIcon />
          {field.state.value ? format(field.state.value, "PPP") : <span>Velg en dato</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" required selected={field.state.value} onSelect={field.handleChange} />
      </PopoverContent>
    </Popover>
  );
}
