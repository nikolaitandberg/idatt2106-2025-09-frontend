import { ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { useMapObjectTypes } from "@/actions/map";
import LoadingSpinner from "../ui/loadingSpinner";
import Icon from "../ui/icon";

interface MapFinderProps {
  onFindObject?: (typeId: number) => Promise<void>;
}

export default function MapFinder({ onFindObject }: Readonly<MapFinderProps>) {
  const { data: mapObjectTypes, isPending, isError, error } = useMapObjectTypes();
  const [open, setOpen] = useState(false);
  const [findLoading, setFindLoading] = useState(false);
  const [findObjectTypeId, setFindObjectTypeId] = useState<number | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex flex-row gap-1 items-center">
          <ListFilter size={20} className="text-gray-500" />
          <span className="text-gray-500">Finn i kart</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-gray-800">Finn nærmeste kartobjekt</h2>
          {isPending && <LoadingSpinner />}
          {isError && (
            <div className="text-red-500">
              <p>Feil ved lasting av objekttyper</p>
              <p>{error.message}</p>
            </div>
          )}
          {mapObjectTypes?.map((type) => (
            <div key={type.id} className="flex flex-row items-center gap-2">
              <Button
                size="fullWidth"
                className="flex flex-row gap-1 items-center justify-start"
                variant="ghost"
                onClick={async () => {
                  setFindLoading(true);
                  setFindObjectTypeId(type.id);
                  await onFindObject?.(type.id);
                  setOpen(false);
                  setFindLoading(false);
                  setFindObjectTypeId(null);
                }}>
                <Icon icon={type.icon} className="text-gray-500" size={20} />
                {type.name}
                {findLoading && findObjectTypeId === type.id && <LoadingSpinner />}
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
