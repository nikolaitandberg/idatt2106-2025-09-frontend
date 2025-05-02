import { useQueryClient } from "@tanstack/react-query";
import { CreateEventRequest } from "@/types";
import { z } from "zod";
import FormSection from "../ui/form/formSection";
import useAppForm from "@/util/formContext";
import FormError from "../ui/form/formError";
import { useCreateEvent, useUpdateEvent, useSeverities } from "@/actions/event";
import { useInfoPages } from "@/actions/learning";
import { Event, Severity } from "@/types/event";

interface EventFormProps {
  onClose?: () => void;
  event?: Event;
  isEdit?: boolean;
}

export default function EventForm({ onClose, event, isEdit = false }: EventFormProps) {
  const queryClient = useQueryClient();
  const severities = useSeverities();
  const infoPages = useInfoPages();
  const { mutate: createEvent, error: createError } = useCreateEvent();
  const { mutate: editEvent, error: editError } = useUpdateEvent();

  const error = isEdit ? editError : createError;

  const defaultValues: Omit<CreateEventRequest, "latitude" | "longitude" | "startTime" | "endTime"> & {
    startTime: Date;
    endTime?: Date;
    position?: {
      latitude: number;
      longitude: number;
    };
  } =
    event && isEdit
      ? {
          severityId: event.severityId,
          radius: event.radius,
          startTime: new Date(event.startTime || Date.now()),
          endTime: event.endTime ? new Date(event.endTime) : undefined,
          recommendation: event.recommendation || "",
          infoPageId: event.infoPageId || undefined,
          position: {
            latitude: event.latitude,
            longitude: event.longitude,
          },
        }
      : {
          severityId: 1,
          radius: 1,
          startTime: new Date(),
          endTime: undefined,
          recommendation: "",
          infoPageId: undefined,
        };

  const schema = z.object({
    severityId: z.number({
      required_error: "Vennligst velg en alvorlighetsgrad",
      invalid_type_error: "Vennligst velg en gyldig alvorlighetsgrad",
    }),
    position: z.object(
      {
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      },
      { required_error: "Vennligst velg en posisjon" },
    ),
    radius: z.number().min(0.1, { message: "Radius må være minst 0.1 km" }),
    startTime: z.date({
      required_error: "Vennligst velg en starttid",
    }),
    endTime: z.date().optional(),
    recommendation: z.string().optional(),
    infoPageId: z.number().optional(),
  });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      const eventData = {
        latitude: value.position?.latitude ?? 0,
        longitude: value.position?.longitude ?? 0,
        radius: value.radius,
        severityId: value.severityId,
        startTime: value.startTime.toISOString(),
        endTime: value.endTime ? value.endTime.toISOString() : undefined,
        recomendation: value.recommendation ?? undefined,
        infoPageId: value.infoPageId === null ? undefined : value.infoPageId,
      };

      if (isEdit && event) {
        editEvent(
          { id: event.id, ...eventData },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["event"] });
              if (onClose) onClose();
            },
          },
        );
      } else {
        createEvent(eventData, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["event"] });
            if (onClose) onClose();
          },
        });
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2">
      <FormSection title="Hendelsesinformasjon">
        <form.AppField name="severityId">
          {(field) => (
            <field.ComboBox
              label="Alvorlighetsgrad"
              options={severities.data?.map((severity: Severity) => severity.id) || []}
              renderOption={(id: number) => {
                const severity = severities.data?.find((s) => s.id === id);
                return <div>{severity?.name || "Unknown"}</div>;
              }}
              renderSelected={(id: number) => {
                const severity = severities.data?.find((s) => s.id === id);
                return severity?.name || "Unknown";
              }}
            />
          )}
        </form.AppField>

        <form.AppField name="position">
          {(field) => (
            <field.PositionSelector
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

        <form.AppField name="radius">{(field) => <field.NumberInput label="Radius (km)" />}</form.AppField>
      </FormSection>

      <FormSection title="Timing" dividerTop>
        <form.AppField name="startTime">{(field) => <field.DatePicker label="Startdato" />}</form.AppField>
        <form.AppField name="endTime">{(field) => <field.DatePicker label="Sluttdato" />}</form.AppField>
      </FormSection>

      <FormSection title="Tilleggsinformasjon" dividerTop>
        <form.AppField name="recommendation">
          {(field) => <field.TextArea label="Anbefalning" placeholder="Tilby råd til folk i det berørte området" />}
        </form.AppField>

        <form.AppField name="infoPageId">
          {(field) => (
            <field.ComboBox
              label="Læringsside"
              options={infoPages.data?.map((page) => page.id) || []}
              renderOption={(id: number) => {
                const page = infoPages.data?.find((p) => p.id === id);
                return <div>{page?.title || `Info Page #${id}`}</div>;
              }}
              renderSelected={(id: number) => {
                const page = infoPages.data?.find((p) => p.id === id);
                return page?.title || `Info Page #${id}`;
              }}
            />
          )}
        </form.AppField>
      </FormSection>

      <form.AppForm>
        <form.SubmitButton>{isEdit ? "Update Event" : "Create Event"}</form.SubmitButton>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}
