import { useQueryClient } from "@tanstack/react-query";
import { CreateEventRequest } from "@/types";
import { z } from "zod";
import FormSection from "../ui/form/formSection";
import useAppForm from "@/util/formContext";
import FormError from "../ui/form/formError";
import { useCreateEvent, useSeverities } from "@/actions/event";
import { Severity } from "@/types/event";

interface CreateEventFormProps {
  onClose?: () => void;
}

export default function CreateEventForm({ onClose }: CreateEventFormProps) {
  const queryClient = useQueryClient();
  const severities = useSeverities();
  const { mutate: createEvent, error } = useCreateEvent();



  const defaultValues: Omit<CreateEventRequest, "latitude" | "longitude" | "startTime" | "endTime"> & {
    startTime: Date;
    endTime?: Date;
    position?: {
      latitude: number;
      longitude: number;
    };
  } = {
    severityId: 1,
    radius: 1,
    startTime: new Date(),
    endTime: undefined,
    recommendation: "",
    infoPageId: undefined,
  };

  const schema = z.object({
    severityId: z.number({
      required_error: "Severity is required",
      invalid_type_error: "Please select a severity level",
    }),
    position: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
    radius: z.number().min(0.1, { message: "Radius must be at least 0.1 km" }),
    startTime: z.date({
      required_error: "Start time is required",
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
      createEvent(
        {
          latitude: value.position?.latitude ?? 0,
          longitude: value.position?.longitude ?? 0,
          radius: value.radius,
          severityId: value.severityId,
          startTime: value.startTime.toISOString(),
          endTime: value.endTime ? value.endTime.toISOString() : undefined,
          recomendation: value.recommendation ?? undefined,
          infoPageId: value.infoPageId ?? undefined,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["event"] });
            if (onClose) onClose();
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2">
      <FormSection title="Event Information">
        <form.AppField name="severityId">
          {(field) => (
            <field.ComboBox
              label="Severity"
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

        <form.AppField name="radius">
          {(field) => <field.NumberInput label="Radius (km)" />}
        </form.AppField>
      </FormSection>

      <FormSection title="Timing" dividerTop>
        <form.AppField name="startTime">{(field) => <field.DatePicker label="Start Time" />}</form.AppField>

        <form.AppField name="endTime">{(field) => <field.DatePicker label="End Time (Optional)" />}</form.AppField>
      </FormSection>

      <FormSection title="Additional Information" dividerTop>
        <form.AppField name="recommendation">
          {(field) => (
            <field.TextArea label="Recommendation" placeholder="Provide advice for people in the affected area" />
          )}
        </form.AppField>

        <form.AppField name="infoPageId">
          {(field) => <field.NumberInput label="Info Page ID (Optional)" />}
        </form.AppField>
      </FormSection>

      <form.AppForm>
        <form.SubmitButton>Create Event</form.SubmitButton>
      </form.AppForm>

      <FormError error={error?.message} />
    </div>
  );
}
