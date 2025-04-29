import { useCreateMapObjectType } from "@/actions/map";
import { mapIcons } from "@/util/icons";
import { z } from "zod";
import useAppForm from "@/util/formContext";

interface EditMapObjectTypeFormProps {
  onClose?: () => void;
}

export default function CreateMapObjectTypeForm({ onClose }: EditMapObjectTypeFormProps) {
  const { mutate: createMapObjectType } = useCreateMapObjectType();

  const schema = z.object({
    name: z.string().min(1, { message: "Du må skrive inn et navn" }),
    icon: z.string().min(1, { message: "Du må velge et ikon" }),
  }) as z.ZodType<{
    name: string;
    icon: keyof typeof mapIcons;
  }>;

  const createForm = useAppForm({
    defaultValues: {
      name: "",
      icon: "" as keyof typeof mapIcons,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        createMapObjectType(
          {
            name: value.name,
            icon: value.icon,
          },
          {
            onSuccess: onClose,
            onSettled: resolve,
          },
        );
      });
    },
  });

  return (
    <>
      <createForm.AppField name="name">{(field) => <field.TextInput label="Navn" />}</createForm.AppField>
      <createForm.AppField name="icon">{(field) => <field.IconPicker />}</createForm.AppField>
      <createForm.AppForm>
        <createForm.SubmitButton>Lagre</createForm.SubmitButton>
      </createForm.AppForm>
    </>
  );
}
