import { Food } from "@/types/household";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { showToast } from "@/components/ui/toaster";

type AddFoodFormData = Omit<Food, "id" | "householdId" | "typeId">;

interface AddFoodFormProps {
  onSubmit: (data: AddFoodFormData) => void;
  onSuccess?: () => void;
}

export default function AddFoodForm({ onSubmit, onSuccess }: AddFoodFormProps) {
  const defaultValues = {
    expirationDate: new Date(),
    amount: 0,
  };

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
      onSubmit?.({
        ...value,
        expirationDate: value.expirationDate.toISOString(),
      });

      showToast({
        title: "Matvare lagt til",
        description: "Matvaren ble lagt til i husholdningen.",
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
        <form.SubmitButton>Legg til matvare</form.SubmitButton>
      </form.AppForm>
    </div>
  );
}
