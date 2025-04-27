import TextInput from "../ui/textinput";
import { Button } from "../ui/button";
import IconPicker from "../ui/iconPicker";
import { useState } from "react";
import { useCreateMapObjectType } from "@/actions/map";
import LoadingSpinner from "../ui/loadingSpinner";
import { mapIcons } from "@/util/icons";

interface EditMapObjectTypeFormProps {
  onClose?: () => void;
}

export default function CreateMapObjectTypeForm({ onClose }: EditMapObjectTypeFormProps) {
  const [icon, setIcon] = useState<keyof typeof mapIcons | null>(null);
  const [name, setName] = useState("");
  const { mutate: createMapObjectType, isPending } = useCreateMapObjectType();

  const handleSubmit = () => {
    if (!icon || !name) {
      return;
    }

    createMapObjectType(
      {
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
        validate={(v) => v.length > 0}
        validationErrorMessage="Navn må være minst 1 bokstav"
        onChange={setName}
      />
      <IconPicker onSelect={setIcon} />
      <Button type="submit" className="mt-4" size="fullWidth" onClick={handleSubmit}>
        {isPending ? <LoadingSpinner /> : "Lagre endringer"}
      </Button>
    </>
  );
}
