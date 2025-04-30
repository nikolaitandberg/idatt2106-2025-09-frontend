"use client";

import { InfoPage, EditInfoPageRequest } from "@/types/learning";
import { useEditScenario } from "@/actions/learning";
import FormSection from "../ui/form/formSection";
import FormError from "../ui/form/formError";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

interface EditScenarioFormProps {
  scenario: InfoPage;
  onClose: () => void;
}

export default function EditScenarioForm({ scenario, onClose }: EditScenarioFormProps) {
  const { mutate: editScenario, error } = useEditScenario();
  const queryClient = useQueryClient();

  const schema = z.object({
    title: z.string().min(1, { message: "Du må skrive inn en tittel" }),
    shortDescription: z.string().min(1, { message: "Du må skrive inn en kort beskrivelse" }),
    content: z.string().min(1, { message: "Du må skrive inn innhold" }),
  });

  const defaultValues: Omit<EditInfoPageRequest, "id"> = {
    title: scenario.title,
    shortDescription: scenario.shortDescription,
    content: scenario.content,
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        editScenario(
          { id: scenario.id, ...value },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["infoPages"] });
              onClose();
            },
            onSettled: resolve,
          }
        );
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2">
      <FormSection>
        <form.AppField name="title">
          {(field) => <field.TextInput label="Tittel" />}
        </form.AppField>

        <form.AppField name="shortDescription">
          {(field) => <field.TextInput label="Kort beskrivelse" />}
        </form.AppField>

        <form.AppField name="content">
          {(field) => <field.TextArea label="Innhold (Markdown)" />}
        </form.AppField>
      </FormSection>

      <form.AppForm>
        <form.SubmitButton>Lagre</form.SubmitButton>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}