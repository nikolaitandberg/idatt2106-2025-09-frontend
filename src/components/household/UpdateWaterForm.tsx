import { Household } from "@/types/household";
import { useUpdateHouseholdWater } from "@/actions/household";
import { z } from "zod";
import useAppForm from "@/util/formContext";
import FormError from "../ui/form/formError";

export default function UpdateWaterForm({ household, onClose }: { household: Household; onClose?: () => void }) {
  const { mutate: updateWater, error } = useUpdateHouseholdWater();

  const defaultValues = {
    amount: household.waterAmountLiters,
    date: new Date(household.lastWaterChangeDate),
  };

  const schema = z.object({
    amount: z.number().min(0, { message: "Vannmengde må være 0 eller mer." }),
    date: z.date(),
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
          lastWaterChangeDate: value.date.toISOString(),
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
      <form.AppField name="date">{(field) => <field.DatePicker label="Siste dato vann ble byttet" />}</form.AppField>

      <form.AppForm>
        <div className="flex justify-end gap-2">
          <form.SubmitButton>Lagre</form.SubmitButton>
        </div>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}
