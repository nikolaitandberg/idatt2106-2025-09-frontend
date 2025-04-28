"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Calendar, Image as ImageIcon, Pencil, Trash, Plus } from "lucide-react";
import { cn } from "@/util/cn";

type FoodUnit = {
  amount: string;
  date: string;
  isSoon?: boolean;
};

type FoodAccordionItemProps = {
  id: string;
  name: string;
  totalAmount: string;
  units: FoodUnit[];
};

export default function FoodAccordionItem({
  id,
  name,
  totalAmount,
  units,
}: FoodAccordionItemProps) {
  return (
    <AccordionItem value={id} className="rounded-lg overflow-hidden border">
      <AccordionTrigger className="bg-white px-4 py-3 hover:no-underline">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
          <span className="text-sm text-muted-foreground">{totalAmount}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="bg-muted/30 px-0">
        <button className="w-full py-2 text-sm bg-muted text-muted-foreground text-center hover:bg-muted/50 transition">
          Legg til {name.toLowerCase()} <Plus className="inline w-4 h-4 ml-1" />
        </button>

        {units.map((unit, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between px-4 py-2 border-t",
              index % 2 === 0 ? "bg-white" : "bg-muted/20"
            )}
          >
            <span className="text-sm text-foreground">{unit.amount}</span>

            <span
              className={cn(
                "flex items-center gap-1 text-sm",
                unit.isSoon ? "text-yellow-500" : "text-muted-foreground"
              )}
            >
              <Calendar className="w-4 h-4" />
              {unit.date}
            </span>

            <div className="flex gap-2">
              <button className="p-1 rounded hover:bg-muted transition">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-1 rounded bg-red-100 hover:bg-red-200 transition">
                <Trash className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}