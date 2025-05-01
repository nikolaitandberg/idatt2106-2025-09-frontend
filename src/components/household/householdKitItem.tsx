import { Kit } from "@/types/kit";
import { Checkbox } from "../ui/checkbox";

interface HouseholdKitItemProps {
  kit: Kit;
  householdHasKit: boolean;
  onRemove: () => void;
  onAdd: () => void;
}

export default function HouseholdKitItem({ kit, householdHasKit, onAdd, onRemove }: HouseholdKitItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`kit-${kit.id}`}
          onCheckedChange={(checked) => {
            if (checked) {
              onAdd();
              return;
            }

            onRemove();
          }}
          checked={householdHasKit}
        />
        <label htmlFor={`kit-${kit.id}`} className="text-lg cursor-pointer select-none">
          {kit.name}
        </label>
      </div>
      <p className="text-gray-500">{kit.description}</p>
    </div>
  );
}
