"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toaster";
import { useUnshareSharedFood } from "@/actions/group";
import useAppForm from "@/util/formContext";
import FormSection from "@/components/ui/form/formSection";
import { z } from "zod";

export default function UnshareForm({
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
              onClose();
            },
            onSettled: resolve,
          },
        );
      });
    },
  });

  return (
    <>
      <FormSection>
        <form.AppField name="amount">
          {(field) => <field.NumberInput label={`Antall (maks ${maxAmount})`} {...{ min: 1, max: maxAmount }} />}
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
