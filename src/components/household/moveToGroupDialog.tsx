"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toaster";
import useAppForm from "@/util/formContext";
import FormSection from "@/components/ui/form/formSection";
import FormError from "@/components/ui/form/formError";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMoveFoodToGroup } from "@/actions/group";

interface MoveToGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodId: number;
  maxAmount: number;
}

export default function MoveToGroupDialog({
  open,
  onOpenChange,
  foodId,
  maxAmount,
}: MoveToGroupDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMoveFoodToGroup();

  const schema = z.object({
    groupId: z.number({ invalid_type_error: "Må være et tall" }).int("Må være et heltall").min(1, "Ugyldig ID"),
    amount: z.number({ invalid_type_error: "Må være et tall" }).min(1, "Minst 1").max(maxAmount, `Maks ${maxAmount}`),
  });

  const form = useAppForm({
    defaultValues: { groupId: 1, amount: maxAmount },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await new Promise<void>((resolve) => {
        mutation.mutate(
          {
            foodId,
            groupId: value.groupId,
            amount: value.amount,
          },
          {
            onSuccess: () => {
              showToast({
                title: "Mat delt",
                description: `${value.amount} ble delt med gruppe-ID ${value.groupId}.`,
                variant: "success",
              });
              queryClient.invalidateQueries();
              onOpenChange(false); // ← viktig!
            },
            onError: () => {
              showToast({
                title: "Ugyldig gruppe-ID",
                description: "Gå til gruppesiden for å finne ID.",
                variant: "error",
              });
              onOpenChange(false);
            },
            onSettled: () => resolve(),
          },
        );
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Del mat med gruppe</DialogTitle>
        </DialogHeader>

        <FormSection>
          <form.AppField name="groupId">
            {(field) => <field.NumberInput label="Gruppe ID (finnes på gruppesiden)" />}
          </form.AppField>

          <form.AppField name="amount">
            {(field) => <field.NumberInput label={`Mengde (maks ${maxAmount})`} />}
          </form.AppField>
        </FormSection>

        <form.AppForm>
          <DialogFooter className="mt-4">
            <form.SubmitButton>Del mat</form.SubmitButton>
          </DialogFooter>
        </form.AppForm>

        <FormError error={mutation.error?.message} />
      </DialogContent>
    </Dialog>
  );
}