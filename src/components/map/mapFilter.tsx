import { ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useState } from "react";
import { useMapObjectTypes } from "@/actions/map";
import LoadingSpinner from "../ui/loadingSpinner";
import { Checkbox } from "../ui/checkbox";

interface MapFilterProps {
  onMapObjectTypesChange?: (types: number[]) => void;
}

export default function MapFilter({ onMapObjectTypesChange }: MapFilterProps) {
  const { data: mapObjectTypes, isPending, isError, error } = useMapObjectTypes();
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (mapObjectTypes) {
      setSelectedTypes(mapObjectTypes.map((type) => type.id));
    }
  }, [mapObjectTypes]);

  useEffect(() => {
    if (onMapObjectTypesChange) {
      onMapObjectTypesChange(selectedTypes);
    }
  }, [selectedTypes, onMapObjectTypesChange]);

  const toggleFilter = () => {
    setFilterOpen((prev) => !prev);
  };

  return (
    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={toggleFilter}
          variant="ghost"
          size="fullWidth"
          className="flex flex-row gap-1 justify-start px-2 md:justify-center items-center">
          <ListFilter size={20} className="text-gray-500" />
          <span className="text-gray-500">Filtrer</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="bg-white">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm md:text-lg font-medium text-gray-800">Filtrer objekttyper</h2>
          {isPending && <LoadingSpinner />}
          {isError && (
            <div className="text-red-500">
              <p>Feil ved lasting av objekttyper</p>
              <p>{error.message}</p>
            </div>
          )}
          {mapObjectTypes?.map((type) => (
            <div key={type.id} className="flex flex-row items-center gap-2">
              <Checkbox
                className="size-4"
                id={`filter-${type.id}`}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes((prev) => [...prev, type.id]);
                    return;
                  }
                  setSelectedTypes((prev) => prev.filter((id) => id !== type.id));
                }}
              />
              <label htmlFor={`filter-${type.id}`} className="text-gray-700 select-none text-sm md:text-base">
                {type.name}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
