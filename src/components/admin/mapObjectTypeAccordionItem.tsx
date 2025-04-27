import { Pencil, Plus, Trash } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditMapObjectTypeForm from "./editMapObjectTypeForm";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MapObject, MapObjectType } from "@/types/map";
import MapObjectCard from "./mapObjectCard";
import Icon from "../ui/icon";
import ConfirmationDialog from "../ui/confirmationDialog";
import { useDeleteMapObjectType } from "@/actions/map";

interface MapObjectTypeAccordionItemProps {
  type: MapObjectType & { objects: MapObject[] };
}

export default function MapObjectTypeAccordionItem({ type }: MapObjectTypeAccordionItemProps) {
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteMapObjectType, isPending: deleteMapObjectTypeIsPending } = useDeleteMapObjectType();

  return (
    <AccordionItem key={type.id} value={String(type.id)}>
      <div className="relative">
        <div className="relative">
          <AccordionTrigger>
            <div className="flex items-center gap-2 w-full">
              <Icon icon={type.icon} size={24} />
              <span>{type.name}</span>
              <span className="text-muted-foreground">
                {type.objects.length} {type.objects.length === 1 ? "objekt" : "objekter"}
              </span>
            </div>
          </AccordionTrigger>
          <div className="flex items-center absolute right-8 top-0 h-full">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={"ghost"}>
                  <Pencil className="text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Rediger {type.name.toLowerCase()}</DialogTitle>
                <EditMapObjectTypeForm
                  mapObjectType={type}
                  onClose={() => {
                    setEditDialogOpen(false);
                    queryClient.invalidateQueries({
                      queryKey: ["map"],
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button variant={"ghost"} onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="text-destructive" />
            </Button>
            <ConfirmationDialog
              open={deleteDialogOpen}
              confirmIsPending={deleteMapObjectTypeIsPending}
              title="Slett kartkategori"
              description={`Er du sikker på at du vil slette kategorien ${type.name}?`}
              variant="critical"
              confirmText="Slett"
              cancelText="Avbryt"
              onConfirm={() => {
                deleteMapObjectType(type.id, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["map"],
                    });
                    setDeleteDialogOpen(false);
                  },
                  onError: (error) => {
                    console.error("Error deleting map object type:", error);
                  },
                });
              }}
              onCancel={() => {
                setDeleteDialogOpen(false);
              }}
            />
          </div>
        </div>
      </div>
      <AccordionContent>
        <div className="flex flex-col items-center gap-2">
          <Button size="fullWidth" className="mb-4">
            <div>Legg til ny {type.name}</div>
            <Plus strokeWidth={1} size={20} />
          </Button>
          {type.objects.map((object) => (
            <MapObjectCard mapObject={object} key={object.id} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
