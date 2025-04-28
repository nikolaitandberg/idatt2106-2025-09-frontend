import { useEditMapObject } from "@/actions/map";
import { EditMapObjectRequest, MapObject, MapObjectType } from "@/types";
import { useState } from "react";
import FormSection from "../ui/formSection";
import TextInput from "../ui/textinput";
import PositionSelector from "../ui/positionSelector";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import TimeSelector from "../ui/timeSelector";

interface EditMapObjectFormProps {
  mapObject: MapObject;
  mapObjectType: MapObjectType;
  onClose: () => void;
}

export default function EditMapObjectForm({ mapObject, mapObjectType, onClose }: EditMapObjectFormProps) {
  const { mutate: createMapObject, isPending } = useEditMapObject();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [opening, setOpening] = useState<Date | null>(new Date(mapObject.opening ?? 0));
  const [closing, setClosing] = useState<Date | null>(new Date(mapObject.closing ?? 0));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const description = formData.get("description") as string;
    const contactName = formData.get("name") as string;
    const contactEmail = formData.get("email") as string;
    const contactPhone = formData.get("phone") as string;
    const latitude = position.latitude;
    const longitude = position.longitude;
    const data: EditMapObjectRequest = {
      description,
      contactName,
      contactEmail,
      contactPhone,
      latitude,
      longitude,
      typeId: mapObject.typeId,
      id: mapObject.id,
      opening: opening && opening.getTime() > 0 ? opening.getTime().toString() : undefined,
      closing: closing && closing.getTime() > 0 ? closing.getTime().toString() : undefined,
    };

    createMapObject(data, {
      onSuccess: () => {
        if (onClose) {
          onClose();
        }
      },
      onError: (error) => {
        console.error("Error creating map object:", error);
      },
    });
  };

  return (
    <form className="flex flex-col gap-4 border-t-1 border-foreground-muted pt-2" onSubmit={handleSubmit}>
      <FormSection title="Generell informasjon">
        <TextInput label="Beskrivelse" type="text" name="description" initialValue={mapObject.description} />
        <PositionSelector
          onChange={setPosition}
          icon={mapObjectType.icon}
          initialPosition={{
            latitude: mapObject.latitude,
            longitude: mapObject.longitude,
          }}
        />
      </FormSection>
      <FormSection title="Kontaktinformasjon" dividerTop>
        <TextInput label="Navn" type="text" name="name" initialValue={mapObject.contactName} />
        <TextInput label="E-post" type="email" name="email" initialValue={mapObject.contactEmail} />
        <TextInput label="Telefonnummer" name="phone" type="text" initialValue={mapObject.contactPhone} />
      </FormSection>
      <FormSection title="Åpningstider" dividerTop>
        <div className="flex flex-row gap-8">
          <TimeSelector
            initialValue={{
              hours: new Date(opening ?? 0).getUTCHours(),
              minutes: new Date(opening ?? 0).getUTCMinutes(),
            }}
            label="Åpner"
            onChange={(time) => {
              const newDate = new Date(opening ?? 0);
              newDate.setUTCHours(time.hours, time.minutes);
              setOpening(newDate);
            }}
          />
          <TimeSelector
            initialValue={{
              hours: new Date(closing ?? 0).getUTCHours(),
              minutes: new Date(closing ?? 0).getUTCMinutes(),
            }}
            label="Stenger"
            onChange={(time) => {
              const newDate = new Date(closing ?? 0);
              newDate.setUTCHours(time.hours, time.minutes);
              setClosing(newDate);
            }}
          />
        </div>
      </FormSection>
      <Button type="submit" className="mt-4" size="fullWidth">
        {isPending ? <LoadingSpinner /> : "Lagre endringer"}
      </Button>
    </form>
  );
}
