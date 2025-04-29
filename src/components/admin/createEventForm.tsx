"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/textinput";
import FormSection from "@/components/ui/formSection";
import PositionSelector from "@/components/ui/positionSelector";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { useSeverities, useCreateEvent } from "@/actions/event";
import { MAP_BOUNDS_MAX } from "@/types/map";
import { AlertTriangle } from "lucide-react";

interface CreateEventFormProps {
  onClose?: () => void;
}

export default function CreateEventForm({ onClose }: CreateEventFormProps) {
  const queryClient = useQueryClient();
  const { data: severities, isLoading: severitiesLoading } = useSeverities();
  const { mutate: createEvent, isPending } = useCreateEvent();
  const [position, setPosition] = useState({ latitude: 59.9139, longitude: 10.7522 }); // Default to Oslo
  const [radius, setRadius] = useState("1");
  const [selectedSeverity, setSelectedSeverity] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string>(new Date().toISOString().substring(0, 16));
  const [endTime, setEndTime] = useState<string>("");
  const [infoPageId, setInfoPageId] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const recommendation = formData.get("recommendation") as string;

    // Validation
    if (!selectedSeverity) {
      alert("Velg en alvorlighetsgrad");
      return;
    }

    if (isNaN(parseFloat(radius)) || parseFloat(radius) <= 0) {
      alert("Radius må være et positivt tall");
      return;
    }

    const eventData = {
      latitude: position.latitude,
      longitude: position.longitude,
      radius: parseFloat(radius),
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
      severityId: selectedSeverity,
      recomendation: recommendation || null,
      info_page_id: infoPageId ? parseInt(infoPageId) : null,
    };

    createEvent(eventData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["events", MAP_BOUNDS_MAX] });
        if (onClose) onClose();
      },
      onError: (error) => {
        console.error("Error creating event:", error);
      },
    });
  };

  return (
    <form className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2" onSubmit={handleSubmit}>
      <FormSection title="Lokasjon"></FormSection>

      <FormSection title="Hendelsesdetaljer" dividerTop></FormSection>

      <Button type="submit" className="mt-4" size="fullWidth">
        {isPending ? <LoadingSpinner /> : "Opprett hendelse"}
      </Button>
    </form>
  );
}