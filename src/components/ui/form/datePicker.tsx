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
  errorsClassName?: string;
}

export default function DatePicker({ label, errorsClassName }: DatePickerProps) {
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
      <div className={cn("mt-1 text-red-500 text-sm [&>*]:not-last:mr-2", errorsClassName)}>
        {field.state.meta.errors.length > 0 &&
          field.state.meta.errors.map((error) => <span key={error.validation + error.message}>{error.message}</span>)}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" required selected={field.state.value} onSelect={field.handleChange} />
      </PopoverContent>
    </Popover>
  );
}
