import { MapObjectType } from "@/types/map";
import TextInput from "../ui/textinput";
import { Button } from "../ui/button";
import IconPicker from "../ui/iconPicker";
import { useState } from "react";
import { useMutateMapObjectType } from "@/actions/map";
import LoadingSpinner from "../ui/loadingSpinner";

interface EditMapObjectTypeFormProps {
  mapObjectType: MapObjectType;
  onClose?: () => void;
}

export default function EditMapObjectTypeForm({ mapObjectType, onClose }: EditMapObjectTypeFormProps) {
  const [icon, setIcon] = useState(mapObjectType.icon);
  const [name, setName] = useState(mapObjectType.name);
  const { mutate: updateMapObjectType, isPending } = useMutateMapObjectType();

  const handleSubmit = () => {
    if (!icon || !name) {
      return;
    }

    updateMapObjectType(
      {
        id: mapObjectType.id,
        name,
        icon,
      },
      {
        onSuccess: onClose,
        onError: (error) => {
          console.error("Error updating map object type:", error);
        },
      },
    );
  };

  return (
    <>
      <TextInput
        label="Navn"
        name="name"
        initialValue={mapObjectType.name}
        validate={(v) => v.length > 0}
        validationErrorMessage="Navn må være minst 1 bokstav"
        onChange={setName}
      />
      <IconPicker initialValue={mapObjectType.icon} onSelect={setIcon} />
      <Button type="submit" className="mt-4" size="fullWidth" onClick={handleSubmit}>
        {isPending ? <LoadingSpinner /> : "Lagre endringer"}
      </Button>
    </>
  );
}
