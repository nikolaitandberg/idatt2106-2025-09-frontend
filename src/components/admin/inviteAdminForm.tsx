import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import useAppForm from "@/util/formContext";
import FormError from "../ui/form/formError";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { showToast } from "@/components/ui/toaster";
import { useInviteAdmin } from "@/actions/admin";

interface InviteAdminFormProps {
  open: boolean;
  onClose: () => void;
}

export function InviteAdminForm({ open, onClose }: InviteAdminFormProps) {
  const [error] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const { mutate: inviteAdmin } = useInviteAdmin();

  const defaultValues = {
    username: "",
  };

  const schema = z.object({
    username: z.string().min(3, "Brukernavn må være minst 3 tegn"),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        inviteAdmin(
          {
            username: value.username,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["admin", "invite"] });
              showToast({
                title: "Invitasjon sendt",
                description: `Invitasjon til ${value.username} er sendt`,
                variant: "success",
              });
              onClose();
            },
            onError: (error) => {
              showToast({
                title: "Feil",
                description: error.message || "Kunne ikke sende invitasjon",
                variant: "error",
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Inviter administrator</DialogTitle>
        <div className="flex flex-col gap-4 pt-2">
          <form.AppField name="username">{(field) => <field.TextInput label="Brukernavn" />}</form.AppField>

          <form.AppForm>
            <form.SubmitButton>Send invitasjon</form.SubmitButton>
          </form.AppForm>

          <FormError error={error} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
