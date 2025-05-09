import { useCreateMapObject } from "@/actions/map";
import { CreateMapObjectRequest, MapObjectType } from "@/types";
import FormSection from "../ui/form/formSection";
import useAppForm from "@/util/formContext";
import { z } from "zod";
import { Time } from "@/types/time";
import FormError from "../ui/form/formError";
import { showToast } from "@/components/ui/toaster";

interface CreateMapObjectFormProps {
  mapObjectType: MapObjectType;
  onClose?: () => void;
}
export default function CreateMapObjectForm({ mapObjectType, onClose }: CreateMapObjectFormProps) {
  const { mutate: createMapObject, error } = useCreateMapObject();

  const schema = z
    .object({
      description: z.string().min(1, { message: "Du må skrive inn en beskrivelse" }),
      contactName: z.string().optional(),
      contactEmail: z.union([z.string().email({ message: "Ugyldig e-postadresse" }), z.literal("")]),
      contactPhone: z.string().optional(),
      position: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
      opening: z
        .object({
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
          toDate: z.function().returns(z.date()),
        })
        .optional(),
      closing: z
        .object({
          hours: z.number().min(0).max(23),
          minutes: z.number().min(0).max(59),
          toDate: z.function().args().returns(z.date()),
        })
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.opening || !data.closing) return true;
        const openingTime = data.opening.toDate();
        const closingTime = data.closing.toDate();
        return openingTime.getTime() < closingTime.getTime();
      },
      {
        message: "Åpningstiden må være før stengingstiden",
        path: ["opening"],
      },
    );

  const defaultValues: Omit<CreateMapObjectRequest, "typeId" | "closing" | "opening" | "latitude" | "longitude"> & {
    opening?: Time;
    closing?: Time;
    position?: {
      latitude: number;
      longitude: number;
    };
  } = {
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    position: undefined,
    opening: undefined,
    closing: undefined,
  };

  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => {
        createMapObject(
          {
            ...value,
            typeId: mapObjectType.id,
            opening: value.opening ? value.opening.toDate().getTime().toString() : undefined,
            closing: value.closing ? value.closing.toDate().getTime().toString() : undefined,
            latitude: value.position?.latitude ?? 0,
            longitude: value.position?.longitude ?? 0,
          },
          {
            onSuccess: () => {
              showToast({
                title: "Kartobjekt opprettet",
                description: `"${value.description}" ble lagt til.`,
                variant: "success",
              });
              onClose?.();
            },
            onSettled: () => resolve,
          },
        );
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2">
      <FormSection title="Generell informasjon">
        <form.AppField name="description">{(field) => <field.TextInput label="Beskrivelse" />}</form.AppField>
        <form.AppField name="position">
          {(field) => (
            <field.PositionSelector
              icon={mapObjectType.icon}
              initialMapViewState={
                field.state.value && {
                  latitude: field.state?.value?.latitude,
                  longitude: field.state?.value?.longitude,
                  zoom: 12,
                }
              }
            />
          )}
        </form.AppField>
      </FormSection>
      <FormSection title="Kontaktinformasjon" dividerTop>
        <form.AppField name="contactName">{(field) => <field.TextInput label="Navn" />}</form.AppField>
        <form.AppField name="contactEmail">{(field) => <field.TextInput label="E-post" type="email" />}</form.AppField>
        <form.AppField name="contactPhone">{(field) => <field.TextInput label="Telefonnummer" />}</form.AppField>
      </FormSection>
      <FormSection title="Åpningstider" dividerTop>
        <div className="flex flex-row gap-8">
          <form.AppField name="opening">
            {(field) => (
              <div>
                <field.TimeSelector />
                {field.state.meta.errors && <FormError error={field.state.meta.errors[0]?.message} />}
              </div>
            )}
          </form.AppField>
          <form.AppField name="closing">{(field) => <field.TimeSelector />}</form.AppField>
        </div>
      </FormSection>
      <form.AppForm>
        <form.SubmitButton>Lagre</form.SubmitButton>
      </form.AppForm>
      <FormError error={error?.message} />
    </div>
  );
}
