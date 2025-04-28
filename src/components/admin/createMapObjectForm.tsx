import { useCreateMapObject } from "@/actions/map";
import { CreateMapObjectRequest, MapObjectType } from "@/types";
import TextInput from "../ui/textinput";
import FormSection from "../ui/formSection";
import PositionSelector from "../ui/positionSelector";
import { useState } from "react";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";

interface CreateMapObjectFormProps {
  mapObjectType: MapObjectType;
  onClose?: () => void;
}

export default function CreateMapObjectForm({ mapObjectType, onClose }: CreateMapObjectFormProps) {
  const { mutate: createMapObject, isPending } = useCreateMapObject();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(event.currentTarget);
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const description = formData.get("description") as string;
    const contactName = formData.get("name") as string;
    const contactEmail = formData.get("email") as string;
    const contactPhone = formData.get("phone") as string;
    const latitude = position.latitude;
    const longitude = position.longitude;
    const data: CreateMapObjectRequest = {
      description,
      contactName,
      contactEmail,
      contactPhone,
      latitude,
      longitude,
      typeId: mapObjectType.id,
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
        <TextInput label="Beskrivelse" type="text" name="description" />
        <PositionSelector onChange={setPosition} icon={mapObjectType.icon} />
      </FormSection>
      <FormSection title="Kontaktinformasjon" dividerTop>
        <TextInput label="Navn" type="text" name="name" />
        <TextInput label="E-post" type="email" name="email" />
        <TextInput label="Telefonnummer" name="phone" type="text" />
      </FormSection>
      <Button type="submit" className="mt-4" size="fullWidth">
        {isPending ? <LoadingSpinner /> : "Opprett objekt"}
      </Button>
    </form>
  );
}
