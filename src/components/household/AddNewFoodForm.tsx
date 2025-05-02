import { Food } from "@/types/household";
import useAppForm from "@/util/formContext";

interface AddNewFoodFormProps {
  onSubmit: (food: Omit<Food, "householdId" | "id">) => Promise<void>;
}

export default function AddNewFoodForm({ onSubmit }: AddNewFoodFormProps) {
  const form = useAppForm({
    defaultValues: {
      typeId: 0,
      amount: 0,
      expirationDate: new Date(),
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
