import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useUpdateUser } from "@/actions/user";
import useAppForm from "@/util/formContext";
import FormSection from "../ui/form/formSection";
import FormError from "../ui/form/formError";
import { User } from "@/types/user";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface EditUserProfileFormProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function EditUserProfileForm({ open, onClose, user }: EditUserProfileFormProps) {
  const queryClient = useQueryClient();
  const { mutate: updateUser, error } = useUpdateUser();

  const defaultValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  };

  const schema = z.object({
    firstName: z.string().min(1, { message: "Fornavn må oppgis" }),
    lastName: z.string().min(1, { message: "Etternavn må oppgis" }),
    email: z.string().email({ message: "Ugyldig e-postadresse" }),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      updateUser(
        {
          id: user.id,
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", user.id] });
            onClose();
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Rediger profil</DialogTitle>
        <div className="flex flex-col gap-4 pt-2" data-testid="profile-edit-form">
          <FormSection title="Personlig informasjon">
            <form.AppField name="firstName">{(field) => <field.TextInput label="Fornavn" />}</form.AppField>
            <form.AppField name="lastName">{(field) => <field.TextInput label="Etternavn" />}</form.AppField>
          </FormSection>

          <FormSection title="Kontoinformasjon" dividerTop>
            <form.AppField name="email">{(field) => <field.TextInput label="E-post" type="email" />}</form.AppField>
          </FormSection>

          <form.AppForm>
            <form.SubmitButton>Lagre endringer</form.SubmitButton>
          </form.AppForm>

          <FormError error={error?.message} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
