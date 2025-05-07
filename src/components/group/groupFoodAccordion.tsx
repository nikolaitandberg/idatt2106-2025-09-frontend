"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toaster";
import { ImageIcon, Calendar, ArrowRightLeft } from "lucide-react";
import { useHousehold, useMyHousehold } from "@/actions/household";
import { useUnshareSharedFood } from "@/actions/group";
import { cn } from "@/util/cn";
import { useState } from "react";
import { SharedFoodByHousehold } from "@/types/group";
import useAppForm from "@/util/formContext";
import FormSection from "@/components/ui/form/formSection";
import { z } from "zod";

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

export default function GroupSharedFoodAccordion({
  foodByHousehold,
}: GroupFoodAccordionProps) {
  const { data: myHousehold } = useMyHousehold();
  const [openDialogForId, setOpenDialogForId] = useState<number | null>(null);

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {foodByHousehold.map((group) => (
        <AccordionItem
          key={group.typeId}
          value={group.typeId.toString()}
          className="rounded-lg overflow-hidden border"
        >
          <AccordionTrigger className="bg-white px-4 py-3 hover:no-underline">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {group.typeName}
                </span>
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
                    index % 2 === 0 ? "bg-white" : "bg-muted/20"
                  )}
                >
                  <span className="text-sm text-foreground">
                    <HouseholdName householdId={batch.householdId} />
                  </span>

                  <span
                    className={cn(
                      "flex items-center justify-center gap-1 text-sm",
                      isExpiringSoon(batch.expirationDate)
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    {batch.expirationDate}
                  </span>

                  <span className="text-sm text-right text-foreground">
                    {batch.amount} {group.unit}
                  </span>

                  {isOwner && (
                    <Dialog
                      open={openDialogForId === batch.id}
                      onOpenChange={(open) =>
                        setOpenDialogForId(open ? batch.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <button
                          className="p-1 rounded bg-red-100 hover:bg-red-200 transition"
                          title="Flytt tilbake"
                        >
                          <ArrowRightLeft className="w-4 h-4 text-red-500" />
                        </button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogTitle>Flytt mat tilbake</DialogTitle>

                        <UnshareForm
                          foodId={batch.id}
                          groupHouseholdId={batch.householdId}
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

function UnshareForm({
  foodId,
  groupHouseholdId,
  maxAmount,
  onClose,
}: {
  foodId: number;
  groupHouseholdId: number;
  maxAmount: number;
  onClose: () => void;
}) {
  const { mutate: unshare } = useUnshareSharedFood();

  const schema = z.object({
    amount: z
      .number({ invalid_type_error: "Må vær et tall" })
      .min(1, "Må være minst 1")
      .max(maxAmount, `Må være maks ${maxAmount}`),
  });

  const form = useAppForm({
    defaultValues: { amount: maxAmount },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await new Promise<void>((resolve) => {
        unshare(
          {
            foodId,
            groupHouseholdId,
            amount: value.amount,
          },
          {
            onSuccess: () => {
              showToast({
                title: "Flyttet tilbake",
                description: `${value.amount} ble flyttet tilbake til din husholdning.`,
                variant: "success",
              });
              onClose();
            },
            onError: () => {
              showToast({
                title: "Feil",
                description: "Kunne ikke flytte tilbake mat.",
                variant: "error",
              });
            },
            onSettled: resolve,
          }
        );
      });
    },
  });

  return (
    <>
      <FormSection>
        <form.AppField name="amount">
          {(field) => (
            <field.NumberInput
              label={`Antall (maks ${maxAmount})`}
              {...{ min: 1, max: maxAmount }}
            />
          )}
        </form.AppField>
      </FormSection>

      <form.AppForm>
        <DialogFooter className="mt-4">
          <form.SubmitButton>Flytt tilbake</form.SubmitButton>
        </DialogFooter>
      </form.AppForm>
    </>
  );
}