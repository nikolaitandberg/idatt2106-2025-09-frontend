"use client";

import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { showToast } from "../ui/toaster";
import useAppForm from "@/util/formContext";
import { useCreateGroup } from "@/actions/group";
import FormSection from "../ui/form/formSection";
import FormError from "../ui/form/formError";
import { z } from "zod";

export default function CreateGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: createGroup, error } = useCreateGroup();

  const schema = z.object({
    name: z.string().min(1, { message: "Du må skrive inn et navn" }),
    description: z.string().min(1, { message: "Du må skrive inn en beskrivelse" }),
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        createGroup(value, {
          onSuccess: () => {
            showToast({
              title: "Gruppe opprettet",
              description: `"${value.name}" ble opprettet.`,
              variant: "success",
            });
            onOpenChange(false);
          },
          onError: () => {
            showToast({
              title: "Feil",
              description: "Kunne ikke opprette gruppe.",
              variant: "error",
            });
          },
          onSettled: resolve,
        });
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Ny gruppe</DialogTitle>

        <FormSection>
          <form.AppField name="name">{(field) => <field.TextInput label="Navn" />}</form.AppField>
          <form.AppField name="description">{(field) => <field.TextInput label="Beskrivelse" />}</form.AppField>
        </FormSection>

        <form.AppForm>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost">Avbryt</Button>
            </DialogClose>
            <form.SubmitButton>Opprett</form.SubmitButton>
          </DialogFooter>
        </form.AppForm>

        <FormError error={error?.message} />
      </DialogContent>
    </Dialog>
  );
}