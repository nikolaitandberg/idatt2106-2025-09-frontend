"use client";

import { useQueryClient } from "@tanstack/react-query";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import FormSection from "@/components/ui/form/formSection";
import FormError from "@/components/ui/form/formError";
import { useEditGroup } from "@/actions/group";
import { showToast } from "@/components/ui/toaster";

interface EditGroupFormProps {
  group: {
    id: number;
    name: string;
    description: string;
  };
  onClose: () => void;
}

export default function EditGroupForm({ group, onClose }: EditGroupFormProps) {
  const queryClient = useQueryClient();
  const { mutate: editGroup, error } = useEditGroup();

  const schema = z.object({
    name: z.string().min(1, { message: "Du må skrive inn et navn" }),
    description: z.string().min(1, { message: "Du må skrive inn en beskrivelse" }),
  });

  const form = useAppForm({
    defaultValues: {
      name: group.name,
      description: group.description,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        editGroup(
          { id: group.id, ...value },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["group", group.id] });
              showToast({
                title: "Endret gruppe",
                description: "Gruppen ble oppdatert",
                variant: "success",
              });
              onClose();
            },
            onSettled: resolve,
          },
        );
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 border-t pt-2">
      <FormSection>
        <form.AppField name="name">{(field) => <field.TextInput label="Navn på gruppe" />}</form.AppField>

        <form.AppField name="description">{(field) => <field.TextInput label="Beskrivelse" />}</form.AppField>
      </FormSection>

      <form.AppForm>
        <form.SubmitButton>Lagre</form.SubmitButton>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}
