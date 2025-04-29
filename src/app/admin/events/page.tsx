"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAP_BOUNDS_MAX } from "@/types/map";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DialogContent, DialogTitle, DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useEvents, useSeverities } from "@/actions/event";
import CreateEventForm from "@/components/admin/createEventForm";

export default function AdminEvents() {
  const events = useEvents(MAP_BOUNDS_MAX);
  const severities = useSeverities();
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);

  if (events.isPending || severities.isPending) {
    return <div>Loading...</div>;
  }
  if (events.isError || severities.isError) {
    return <div>Feil ved lasting av hendelser</div>;
  }

  // Custom date formatting function to replace date-fns
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Ikke satt";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hendelser</h1>
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Aktive hendelser</TabsTrigger>
          <TabsTrigger value="archive">Arkiv</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between mb-4 mt-4">
              <h2 className="text-2xl">Hendelser</h2>
              <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="default">
                    Legg til ny hendelse <Plus size={20} strokeWidth={1} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Legg til ny hendelse</DialogTitle>
                  <CreateEventForm onClose={() => setNewEventDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {events.data.map((event) => {
                const severity = severities.data.find((s) => s.id === event.severityId);
                return (
                  <AccordionItem key={event.id} value={`event-${event.id}`}>
                    <AccordionTrigger className="flex justify-between px-4">
                      <div className="flex items-center gap-4">
                        {severity && (
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: severity.colour }} />
                        )}
                        <span>Hendelse {event.id}</span>
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-md"
                          style={{
                            backgroundColor: severity?.colour || "gray",
                            color: getBadgeTextColor(severity?.colour || ""),
                          }}>
                          {severity?.name || "Ukjent"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-2">
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Plassering</p>
                            <p>
                              Lat: {event.latitude.toFixed(6)}, Long: {event.longitude.toFixed(6)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Radius</p>
                            <p>{event.radius} kilometer</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Starttid</p>
                            <p>{formatDate(event.start_time)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Slutttid</p>
                            <p>{formatDate(event.end_time)}</p>
                          </div>
                        </div>

                        {event.recomendation && (
                          <div>
                            <p className="text-sm font-medium">Anbefaling</p>
                            <p>{event.recomendation}</p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Rediger
                          </Button>
                          <Button variant="destructive" size="sm">
                            Slett
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {events.data.length === 0 && <div className="text-center py-8 text-gray-500">Ingen aktive hendelser</div>}
          </div>
        </TabsContent>
        <TabsContent value="archive">
          <div className="text-center py-8 text-gray-500">Arkiv er under utvikling</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to determine text color based on background color
function getBadgeTextColor(bgColor: string): string {
  if (
    bgColor.toLowerCase() === "#ffffff" ||
    bgColor.toLowerCase() === "white" ||
    bgColor.toLowerCase() === "#ffff00" ||
    bgColor.toLowerCase() === "yellow"
  ) {
    return "black";
  }
  return "white";
}
