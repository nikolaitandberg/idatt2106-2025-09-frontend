import { Food } from "@/types/household";
import useAppForm from "@/util/formContext";
import { z } from "zod";

interface AddNewFoodFormProps {
  onSubmit: (food: Omit<Food, "householdId" | "id">) => Promise<void>;
}

export default function AddNewFoodForm({ onSubmit }: AddNewFoodFormProps) {
  const defaultValues = {
    typeId: 0,
    amount: 0,
    expirationDate: new Date(),
  };

  const schema = z.object({
    typeId: z.number().min(1, { message: "Matvare må velges" }),
    amount: z.number().min(1, { message: "Antall må være større enn 0" }),
    expirationDate: z.date(),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        typeId: value.typeId,
        amount: value.amount,
        expirationDate: value.expirationDate.toISOString(),
      });
    },
  });

  return (
    <>
      <form.AppField name="typeId">{(field) => <field.FoodTypePicker label="Velg matvare" />}</form.AppField>
      <form.AppField name="expirationDate">{(field) => <field.DatePicker label="Utløpsdato" />}</form.AppField>
      <form.AppField name="amount">
        {(field) => <field.NumberInput label="Antall" placeholder="Antall" />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton>Legg til</form.SubmitButton>
      </form.AppForm>
    </>
  );
}
