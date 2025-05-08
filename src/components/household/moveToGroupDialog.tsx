"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toaster";
import useAppForm from "@/util/formContext";
import FormError from "@/components/ui/form/formError";
import { z } from "zod";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import { useMoveFoodToGroup, useMyGroupMemberships, getGroupById } from "@/actions/group";
import ComboBox from "@/components/ui/comboBox";
import { useFetch } from "@/util/fetch";
import { useSession } from "next-auth/react";

interface MoveToGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodId: number;
  maxAmount: number;
  unit: string;
}

export default function MoveToGroupDialog({ open, onOpenChange, foodId, maxAmount, unit }: MoveToGroupDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMoveFoodToGroup();
  const fetcher = useFetch();
  const session = useSession();
  const { data: relations = [] } = useMyGroupMemberships();

  const groupQueries = useQueries({
    queries: relations.map((relation) => ({
      queryKey: ["group", "details", relation.groupId],
      queryFn: () => getGroupById(relation.groupId, fetcher),
      enabled: session.status === "authenticated",
    })),
  });

  const allLoaded = groupQueries.every((q) => q.isSuccess);

  const groupOptions = allLoaded
    ? relations.map((relation, index) => {
        const groupData = groupQueries[index].data;
        return {
          id: relation.groupId,
          name: groupData?.groupName ?? `Gruppe ${relation.groupId}`,
        };
      })
    : [];

  const schema = z.object({
    group: z.object({
      id: z.number(),
      name: z.string(),
    }),
    amount: z.number({ invalid_type_error: "Må være et tall" }).min(1, "Minst 1").max(maxAmount, `Maks ${maxAmount}`),
  });

  const form = useAppForm({
    defaultValues: {
      group: groupOptions[0],
      amount: maxAmount,
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      const { id, name } = value.group;
      await new Promise<void>((resolve) => {
        mutation.mutate(
          {
            foodId,
            groupId: id,
            amount: value.amount,
          },
          {
            onSuccess: () => {
              showToast({
                title: "Mat delt",
                description: `${value.amount} ${unit} ble delt med gruppen "${name}".`,
                variant: "success",
              });
              queryClient.invalidateQueries();
              onOpenChange(false);
            },
            onError: () => {
              showToast({
                title: "Feil",
                description: "Kunne ikke dele mat med valgt gruppe.",
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

        <form.AppField name="group">
          {(field) => (
            <ComboBox
              placeholder="Velg en gruppe"
              options={groupOptions}
              onSelect={(selected) => field.setValue(selected)}
              renderOption={(g) => <span>{g.name}</span>}
              renderSelected={(g) => <span>{g.name}</span>}
            />
          )}
        </form.AppField>

        <form.AppField name="amount">
          {(field) => <field.NumberInput label={`Mengde (maks ${maxAmount})`} />}
        </form.AppField>

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
