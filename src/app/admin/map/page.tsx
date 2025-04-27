"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMapObjects, useMapObjectTypes } from "@/actions/map";
import { MAP_BOUNDS_MAX, MapObject, MapObjectType } from "@/types/map";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VisuallyHidden } from "radix-ui";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditMapObjectTypeForm from "@/components/admin/editMapObjectTypeForm";

export default function AdminMap() {
  const mapObjects = useMapObjects(MAP_BOUNDS_MAX);
  const mapObjectTypes = useMapObjectTypes();

  if (mapObjects.isPending || mapObjectTypes.isPending) {
    return <div>Loading...</div>;
  }
  if (mapObjects.isError || mapObjectTypes.isError) {
    return <div>Feil ved lasting av kartobjekter</div>;
  }

  type GroupedMapObjectType = MapObjectType & { objects: MapObject[] };
  const groupedMapObjects = mapObjects.data.reduce((acc: GroupedMapObjectType[], mapObject) => {
    const type = mapObjectTypes.data.find((type) => type.id === mapObject.typeId);
    if (type) {
      const existingType = acc.find((t: GroupedMapObjectType) => t.id === type.id);
      if (existingType) {
        existingType.objects.push(mapObject);
      } else {
        acc.push({ ...type, objects: [mapObject] });
      }
    }
    return acc;
  }, [] as GroupedMapObjectType[]);

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
              {groupedMapObjects.map((type) => (
                <AccordionItem key={type.id} value={String(type.id)}>
                  <div className="relative">
                    <div className="relative">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2 w-full">
                          <span>{type.name}</span>
                          <span className="text-muted-foreground">
                            {type.objects.length} {type.objects.length === 1 ? "objekt" : "objekter"}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <div className="flex items-center absolute right-8 top-0 h-full">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant={"ghost"}>
                              <Pencil className="text-primary" />
                            </Button>
                          </DialogTrigger>
                          <VisuallyHidden.Root>
                            <DialogTitle>Rediger {type.name}</DialogTitle>
                          </VisuallyHidden.Root>
                          <DialogContent>
                            <EditMapObjectTypeForm
                              onSubmit={(e) => {
                                console.log(e);
                              }}
                              mapObjectType={type}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant={"ghost"}>
                          <Trash className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <AccordionContent>
                    {type.objects.map((object) => (
                      <div key={object.id} className="flex justify-between w-full pr-4">
                        <div className="flex items-center gap-2">
                          <span>{object.description}</span>
                          <span className="text-muted-foreground">
                            {object.description} - {object.latitude}, {object.longitude}
                          </span>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="mapObjectTypes"></TabsContent>
      </Tabs>
    </div>
  );
}
