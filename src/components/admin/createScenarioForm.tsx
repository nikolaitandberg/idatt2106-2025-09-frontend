"use client";

import { useCreateScenario } from "@/actions/learning";
import FormSection from "../ui/form/formSection";
import FormError from "../ui/form/formError";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { showToast } from "@/components/ui/toaster";

interface CreateScenarioFormProps {
  onCreated: () => void;
}

export default function CreateScenarioForm({ onCreated }: CreateScenarioFormProps) {
  const { mutate: createScenario, error } = useCreateScenario();

  const schema = z.object({
    title: z.string().min(1, { message: "Du må skrive inn en tittel" }),
    shortDescription: z.string().min(1, { message: "Du må skrive inn en kort beskrivelse" }),
    content: z.string().min(1, { message: "Du må skrive inn innhold" }),
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      shortDescription: "",
      content: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        createScenario(value, {
          onSuccess: () => {
            showToast({
              title: "Scenario opprettet",
              description: `"${value.title}" ble opprettet.`,
              variant: "success",
            });
            onCreated();
          },
          onSettled: resolve,
        });
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2" data-testid="create-scenario-form">
      <FormSection>
        <form.AppField name="title">{(field) => <field.TextInput label="Tittel" />}</form.AppField>

        <form.AppField name="shortDescription">{(field) => <field.TextInput label="Kort beskrivelse" />}</form.AppField>

        <form.AppField name="content">{(field) => <field.TextArea label="Innhold (Markdown)" />}</form.AppField>
      </FormSection>

      <form.AppForm>
        <form.SubmitButton>Opprett</form.SubmitButton>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}
