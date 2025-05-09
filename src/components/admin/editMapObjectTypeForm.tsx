import { MapObjectType } from "@/types/map";
import { useMutateMapObjectType } from "@/actions/map";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { mapIcons } from "@/util/icons";
import FormError from "../ui/form/formError";
import { showToast } from "@/components/ui/toaster";

interface EditMapObjectTypeFormProps {
  mapObjectType: MapObjectType;
  onClose?: () => void;
}

type FormValues = {
  name: string;
  icon: keyof typeof mapIcons;
};

export default function EditMapObjectTypeForm({ mapObjectType, onClose }: EditMapObjectTypeFormProps) {
  const schema = z.object({
    name: z.string().min(1, { message: "Du må skrive inn et navn" }),
    icon: z.string().min(1, { message: "Du må velge et ikon" }),
  }) as z.ZodType<FormValues>;

  const { mutate: updateMapObjectType, error } = useMutateMapObjectType();

  const editForm = useAppForm({
    defaultValues: {
      name: mapObjectType.name,
      icon: mapObjectType.icon,
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        updateMapObjectType(
          {
            id: mapObjectType.id,
            name: value.name,
            icon: value.icon,
          },
          {
            onSuccess: () => {
              showToast({
                title: "Karttype oppdatert",
                description: `"${value.name}" ble oppdatert.`,
                variant: "success",
              });
              onClose?.();
            },
            onSettled: resolve,
          },
        );
      });
    },
  });

  return (
    <>
      <editForm.AppField name="name">{(field) => <field.TextInput label="Navn" />}</editForm.AppField>
      <editForm.AppField name="icon">{(field) => <field.IconPicker />}</editForm.AppField>
      <editForm.AppForm>
        <editForm.SubmitButton>Lagre</editForm.SubmitButton>
      </editForm.AppForm>
      <FormError error={error?.message} />
    </>
  );
}
