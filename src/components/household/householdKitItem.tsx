import { Kit } from "@/types/kit";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";

interface HouseholdKitItemProps {
  kit: Kit;
  householdHasKit: boolean;
  onRemove: () => void;
  onAdd: () => void;
}

export default function HouseholdKitItem({ kit, householdHasKit, onAdd, onRemove }: HouseholdKitItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-2">
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
        <label htmlFor={`kit-${kit.id}`} className="text-lg cursor-pointer select-none break-keep text-nowrap">
          {kit.name}
        </label>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <p className="text-gray-500 text-right line-clamp-1 break-all hover:underline select-none cursor-pointer">
            {kit.description}
          </p>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{kit.name}</DialogTitle>
          <div>
            Beskrivelse
            <p className="text-gray-500">{kit.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function HouseholdKitItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-2">
      <div className="flex items-center gap-2">
        <Checkbox id={`kit-skeleton`} checked={false} disabled />
        <div className="text-lg cursor-pointer select-none break-keep text-nowrap animate-pulse bg-muted rounded w-30 h-7" />
      </div>
      <p className="text-gray-500 text-right line-clamp-1 break-all animate-pulse bg-muted rounded w-full h-7" />
    </div>
  );
}
