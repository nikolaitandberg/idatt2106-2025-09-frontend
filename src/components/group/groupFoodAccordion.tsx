"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ImageIcon, Calendar, ArrowRightLeft } from "lucide-react";
import { useHousehold, useMyHousehold } from "@/actions/household";
import { cn } from "@/util/cn";
import { useState } from "react";
import { SharedFoodByHousehold } from "@/types/group";
import UnshareForm from "@/components/group/unshareDialog";

type GroupSharedFoodAccordionProps = {
  groupId: number; // <-- Ny prop
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

export default function GroupSharedFoodAccordion({ groupId, foodByHousehold }: GroupSharedFoodAccordionProps) {
  const { data: myHousehold } = useMyHousehold();
  const [openDialogForId, setOpenDialogForId] = useState<number | null>(null);

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
            {group.batches.map((batch, index) => {
              const isOwner = batch.householdId === myHousehold?.id;

              return (
                <div
                  key={index}
                  className={cn(
                    "grid grid-cols-[1fr_150px_80px_auto] items-center px-4 py-2 border-t gap-2",
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

                  {isOwner && (
                    <Dialog
                      open={openDialogForId === batch.id}
                      onOpenChange={(open) => setOpenDialogForId(open ? batch.id : null)}>
                      <DialogTrigger asChild>
                        <button className="p-1 rounded bg-red-100 hover:bg-red-200 transition" title="Flytt tilbake">
                          <ArrowRightLeft className="w-4 h-4 text-red-500" />
                        </button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogTitle>Flytt mat tilbake</DialogTitle>

                        <UnshareForm
                          foodId={batch.id}
                          groupId={groupId} // <-- bruker prop
                          maxAmount={batch.amount}
                          onClose={() => setOpenDialogForId(null)}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
