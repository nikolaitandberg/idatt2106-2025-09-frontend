import { CreateFoodTypeRequest } from "@/types";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { Button } from "../ui/button";
import { showToast } from "../ui/toaster";

interface AddFoodTypeFormProps {
  onSubmit: (foodType: CreateFoodTypeRequest) => Promise<void>;
  onCancel?: () => void;
}

//TODO: Add option to upload image when backend is ready

export default function AddFoodTypeForm({ onSubmit, onCancel }: AddFoodTypeFormProps) {
  const schema = z.object({
    name: z.string().min(1, { message: "Navn må fylles ut" }),
    unit: z.string().min(1, { message: "Enhet må fylles ut" }),
    caloriesPerUnit: z
      .number()
      .min(1, { message: "Kalorier per enhet må være større enn 0" })
      .max(10000, { message: "Kalorier per enhet må være mindre enn 10000" }),
    picture: z.string(),
  });

  const defaultValues: CreateFoodTypeRequest = {
    name: "",
    picture: "",
    caloriesPerUnit: 0,
    unit: "",
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);

      showToast({
        title: "Matvaretype lagt til",
        description: `${value.name} ble lagt til som ny type.`,
        variant: "success",
      });
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <>
      <form.AppField name="name">{(field) => <field.TextInput label="Navn" placeholder="Navn" />}</form.AppField>
      <form.AppField name="unit">{(field) => <field.TextInput label="Enhet" placeholder="Enhet" />}</form.AppField>
      <form.AppField name="caloriesPerUnit">
        {(field) => <field.NumberInput label="Kalorier per enhet" placeholder="Kalorier per enhet" />}
      </form.AppField>
      <div className="flex justify-between items-center gap-2">
        <Button variant="outline" size="fullWidth" onClick={onCancel}>
          Avbryt
        </Button>
        <form.AppForm>
          <form.SubmitButton>Legg til</form.SubmitButton>
        </form.AppForm>
      </div>
    </>
  );
}
