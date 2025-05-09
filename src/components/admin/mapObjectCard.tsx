import { MapObject } from "@/types/map";
import { Clock, Mail, Phone, Trash, User, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import ConfirmationDialog from "../ui/confirmationDialog";
import { useDeleteMapObject } from "@/actions/map";
import { useState } from "react";
import { showToast } from "../ui/toaster";

export default function MapObjectCard({
  mapObject,
  onEdit,
  onDelete,
}: {
  mapObject: MapObject;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { mutate: deleteMapObject, isPending: deleteMapObjectIsPending } = useDeleteMapObject();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openDate = new Date(mapObject.opening ?? 0);
  const closeDate = new Date(mapObject.closing ?? 0);

  return (
    <div className="bg-white p-4 rounded-md shadow-md w-full flex flex-col relative">
      <div className="flex flex-col">
        <div className="text-black text-base text-left">{mapObject.description}</div>
        <div className="flex items-center gap-1">
          <User size={10} />
          <div className="text-gray-500 text-sm">{mapObject.contactName}</div>
        </div>
        <div className="flex items-center gap-1">
          <Mail size={10} />
          <div className="text-gray-500 text-sm">{mapObject.contactEmail}</div>
        </div>
        <div className="flex items-center gap-1">
          <Phone size={10} />
          <div className="text-gray-500 text-sm">{mapObject.contactPhone}</div>
        </div>
        {(mapObject.opening || mapObject.closing) && (
          <>
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-t-neutral-200">
              <div className="text-gray-800 text-md">Åpningstider</div>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <div className="text-gray-500 text-sm">
                {openDate.getUTCHours().toString().padStart(2, "0")}:
                {openDate.getUTCMinutes().toString().padStart(2, "0")}
              </div>
              -
              <div className="text-gray-500 text-sm">
                {closeDate.getUTCHours().toString().padStart(2, "0")}:
                {closeDate.getUTCMinutes().toString().padStart(2, "0")}
              </div>
            </div>
          </>
        )}
      </div>

      {onEdit && (
        <Button variant="ghost" className="absolute top-2 right-14" onClick={onEdit} aria-label="Rediger kartobjekt">
          <Pencil size={16} className="text-primary" />
        </Button>
      )}

      {onDelete && (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label="Slett kartobjekt">
            <Trash size={16} className="text-destructive" />
          </Button>
          <ConfirmationDialog
            open={deleteDialogOpen}
            confirmIsPending={deleteMapObjectIsPending}
            onCancel={() => {
              setDeleteDialogOpen(false);
            }}
            onConfirm={() => {
              deleteMapObject(mapObject.id, {
                onSuccess: () => {
                  showToast({
                    title: "Kartobjekt slettet",
                    description: `"${mapObject.description}" ble slettet.`,
                    variant: "success",
                  });
                  onDelete();
                },
              });
            }}
            variant="critical"
            title="Slett objekt"
            description="Er du sikker på at du vil slette dette kartobjektet?"
          />
        </div>
      )}
    </div>
  );
}
