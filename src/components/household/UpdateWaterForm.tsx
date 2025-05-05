import { Household } from "@/types/household";
import { useUpdateHouseholdWater } from "@/actions/household";
import { z } from "zod";
import useAppForm from "@/util/formContext";
import FormError from "../ui/form/formError";

export default function UpdateWaterForm({ household, onClose }: { household: Household; onClose?: () => void }) {
  const { mutate: updateWater, error } = useUpdateHouseholdWater();

  const defaultValues = {
    amount: household.waterAmountLiters,
  };

  const schema = z.object({
    amount: z.number().min(0, { message: "Vannmengde må være minst 1 liter" }),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      updateWater(
        {
          id: household.id,
          waterAmountLiters: value.amount,
          lastWaterChangeDate: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            if (onClose) {
              onClose();
            }
          },
        },
      );
    },
  });

  return (
    <div className="space-y-4">
      <form.AppField name="amount">
        {(field) => <field.NumberInput label="Mengde vann å legge til (liter)" />}
      </form.AppField>

      <form.AppForm>
        <div className="flex justify-end gap-2">
          <form.SubmitButton>Lagre</form.SubmitButton>
        </div>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}
