import { Food } from "@/types/household";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { showToast } from "@/components/ui/toaster";

type EditFoodFormData = Omit<Food, "id" | "householdId" | "typeId">;

interface EditFoodFormProps {
  onSubmit: (data: EditFoodFormData) => void;
  defaultValues: {
    expirationDate: Date;
    amount: number;
  };
  onSuccess?: () => void;
}

export default function EditFoodForm({ onSubmit, defaultValues, onSuccess }: EditFoodFormProps) {
  const schema = z.object({
    expirationDate: z.date(),
    amount: z.number().min(1, { message: "Antall må være større enn 0" }),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      onSubmit({
        ...value,
        expirationDate: value.expirationDate.toISOString(),
      });

      showToast({
        title: "Matvare oppdatert",
        description: "Endringene ble lagret.",
        variant: "success",
      });

      onSuccess?.();
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <form.AppField name="expirationDate">{(field) => <field.DatePicker label="Utløpsdato" />}</form.AppField>
      <form.AppField name="amount">{(field) => <field.NumberInput label="Antall" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton>Oppdater matvare</form.SubmitButton>
      </form.AppForm>
    </div>
  );
}