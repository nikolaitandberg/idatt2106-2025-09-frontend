"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMapObjects, useMapObjectTypes } from "@/actions/map";
import { MAP_BOUNDS_MAX } from "@/types/map";
import { Accordion } from "@/components/ui/accordion";
import MapObjectTypeAccordionItem from "@/components/admin/mapObjectTypeAccordionItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DialogContent, DialogTitle, DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import CreateMapObjectTypeForm from "@/components/admin/createMapObjectTypeForm";

export default function AdminMap() {
  const mapObjects = useMapObjects(MAP_BOUNDS_MAX);
  const mapObjectTypes = useMapObjectTypes();
  const [newMapObjectTypeDialogOpen, setNewMapObjectTypeDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  if (mapObjects.isPending || mapObjectTypes.isPending) {
    return <div>Loading...</div>;
  }
  if (mapObjects.isError || mapObjectTypes.isError) {
    return <div>Feil ved lasting av kartobjekter</div>;
  }

  const groupedMapObjects = mapObjectTypes.data.map((type) => {
    const objects = mapObjects.data.filter((object) => object.typeId === type.id);
    return {
      ...type,
      objects,
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kart</h1>
      <Tabs defaultValue="mapObjects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mapObjects">Kartobjekter</TabsTrigger>
          <TabsTrigger value="mapObjectTypes">Kart</TabsTrigger>
        </TabsList>
        <TabsContent value="mapObjects">
          <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible>
              <div className="flex flex-row items-center justify-between mb-4 mt-4">
                <h2 className="text-2xl">Kartobjekter</h2>
                <Dialog open={newMapObjectTypeDialogOpen} onOpenChange={setNewMapObjectTypeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="default">
                      Legg til ny kategori <Plus size={20} strokeWidth={1} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Legg til ny kategori</DialogTitle>
                    <CreateMapObjectTypeForm
                      onClose={() => {
                        setNewMapObjectTypeDialogOpen(false);
                        queryClient.invalidateQueries({
                          queryKey: ["map", "mapObjectTypes"],
                        });
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              {groupedMapObjects.map((type) => (
                <MapObjectTypeAccordionItem key={type.id} type={type} />
              ))}
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="mapObjectTypes"></TabsContent>
      </Tabs>
    </div>
  );
}
