import { Food } from "@/types/household";
import useAppForm from "@/util/formContext";
import { z } from "zod";

type AddFoodFormData = Omit<Food, "id" | "householdId" | "typeId">;

interface AddFoodFormProps {
  onSubmit?: (data: AddFoodFormData) => void;
}

export default function AddFoodForm({ onSubmit }: AddFoodFormProps) {
  const defaultValues: {
    expirationDate: Date;
    amount: number;
  } = {
    expirationDate: new Date(),
    amount: 0,
  };

  const schema = z.object({
    expirationDate: z.date().refine((date) => date > new Date(), {
      message: "Utløpsdatoen kan ikke være i fortiden",
    }),
    amount: z.number().min(1, { message: "Antall må være større enn 0" }),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      onSubmit?.({
        ...value,
        expirationDate: value.expirationDate.toISOString(),
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <form.AppField name="expirationDate">{(field) => <field.DatePicker label="Utløpsdato" />}</form.AppField>
      <form.AppField name="amount">{(field) => <field.NumberInput label="Antall" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton>Legg til matvare</form.SubmitButton>
      </form.AppForm>
    </div>
  );
}
