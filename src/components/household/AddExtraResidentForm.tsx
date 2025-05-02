import { useExtraResidentTypes } from "@/actions/extraResident";
import { AddExtraResidentRequest } from "@/types";
import { ExtraResidentType } from "@/types/extraResident";
import useAppForm from "@/util/formContext";
import { z } from "zod";

interface AddExtraResidentFormProps {
  onSubmit: (req: Omit<AddExtraResidentRequest, "householdId">) => Promise<void>;
}

export default function AddExtraResidentForm({ onSubmit }: AddExtraResidentFormProps) {
  const { data: residentTypes, isPending, isError, error } = useExtraResidentTypes();

  const schema = z
    .object({
      name: z.string().min(1, { message: "Medlemmet må ha et navn" }),
      type: z
        .object({
          id: z.number(),
          name: z.string(),
          consumptionWater: z.number(),
          consumptionFood: z.number(),
        })
        .nullable(),
    })
    .refine(
      (data) => {
        if (!data.type) {
          return false;
        }

        const type = residentTypes?.find((type) => type.id === data.type?.id);
        return type !== undefined;
      },
      {
        message: "Velg en type",
        path: ["type"],
      },
    );

  const defaultValues: {
    name: string;
    type: ExtraResidentType | null;
  } = {
    name: "",
    type: null,
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name,
        typeId: value.type?.id ?? -1,
      });
    },
  });

  if (isPending) {
    return <div>Laster...</div>;
  }

  if (isError) {
    return <div>Feil ved lasting av deltaker typer + {error.message}</div>;
  }

  return (
    <>
      <form.AppField name="name">
        {(field) => <field.TextInput label="Navn" placeholder="Skriv inn navn" />}
      </form.AppField>
      <form.AppField name="type">
        {(field) => (
          <field.ComboBox
            placeholder="Velg type"
            options={residentTypes}
            renderOption={(option) => <span>{option.name}</span>}
            renderSelected={(option) => <span>{option.name}</span>}
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton>Legg til deltaker</form.SubmitButton>
      </form.AppForm>
    </>
  );
}
