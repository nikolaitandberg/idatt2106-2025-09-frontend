import { AddUserToHouseRequest } from "@/types";
import useAppForm from "@/util/formContext";
import { z } from "zod";

interface AddExistingMemberFormProps {
  onSubmit: (req: Omit<AddUserToHouseRequest, "householdId">) => Promise<void>;
}

export default function AddExistingMemberForm({ onSubmit }: AddExistingMemberFormProps) {
  const schema = z.object({
    username: z.string().min(1, { message: "Brukernavn må fylles ut" }),
  });

  const form = useAppForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ username: value.username });
    },
  });

  return (
    <>
      <form.AppField name="username">{(field) => <field.TextInput label="Brukernavn" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton>Legg til bruker</form.SubmitButton>
      </form.AppForm>
    </>
  );
}
