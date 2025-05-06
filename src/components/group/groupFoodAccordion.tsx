"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SharedFoodByHousehold } from "@/types/group";
import { ImageIcon, Calendar } from "lucide-react";
import { useHousehold } from "@/actions/household";
import { cn } from "@/util/cn";

type GroupFoodAccordionProps = {
  foodByHousehold: SharedFoodByHousehold[];
};

function HouseholdName({ householdId }: { householdId: number }) {
  const { data: household } = useHousehold(householdId);
  return <>{household?.name ?? `Husholdning ${householdId}`}</>;
}

const isExpiringSoon = (expirationDate: string) => {
  const exp = new Date(expirationDate);
  const now = new Date();
  const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < 7;
};

export default function GroupSharedFoodAccordion({ foodByHousehold }: GroupFoodAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {foodByHousehold.map((group) => (
        <AccordionItem key={group.typeId} value={group.typeId.toString()} className="rounded-lg overflow-hidden border">
          <AccordionTrigger className="bg-white px-4 py-3 hover:no-underline">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{group.typeName}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {group.totalAmount} {group.unit}
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="bg-muted/30 px-0">
            {group.batches.map((batch, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-[auto_150px_80px] items-center px-4 py-2 border-t",
                  index % 2 === 0 ? "bg-white" : "bg-muted/20",
                )}>
                <span className="text-sm text-foreground">
                  <HouseholdName householdId={batch.householdId} />
                </span>

                <span
                  className={cn(
                    "flex items-center justify-center gap-1 text-sm",
                    isExpiringSoon(batch.expirationDate) ? "text-yellow-500" : "text-muted-foreground",
                  )}>
                  <Calendar className="w-4 h-4" />
                  {batch.expirationDate}
                </span>

                <span className="text-sm text-right text-foreground">
                  {batch.amount} {group.unit}
                </span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
