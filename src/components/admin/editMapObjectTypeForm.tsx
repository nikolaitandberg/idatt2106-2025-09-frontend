import { MapObjectType } from "@/types/map";
import TextInput from "../ui/textinput";
import { Button } from "../ui/button";
import IconPicker from "../ui/iconPicker";

interface EditMapObjectTypeFormProps {
  mapObjectType: MapObjectType;
  onSubmit: (data: MapObjectType) => void;
}

export default function EditMapObjectTypeForm({ mapObjectType, onSubmit }: EditMapObjectTypeFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: mapObjectType.id,
      name: formData.get("name") as string,
      icon: formData.get("icon") as string,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Navn"
        name="name"
        initialValue={mapObjectType.name}
        validate={(v) => v.length > 0}
        validationErrorMessage="Navn må være minst 1 bokstav"
      />
      <IconPicker />
      <Button type="submit" className="mt-4" size="fullWidth">
        Lagre
      </Button>
    </form>
  );
}
