import { House, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import MapFilter from "./mapFilter";
import MapFinder from "./mapFinder";

interface MapToolBarProps {
  onPositionClick?: () => void;
  onHouseholdClick?: () => void;
  onMapObjectTypesChange?: (types: number[]) => void;
  onFindObject?: (typeId: number) => Promise<void>;
  loading?: boolean;
  canGoToHousehold?: boolean;
}

export default function MapToolBar({
  loading,
  canGoToHousehold,
  onHouseholdClick,
  onPositionClick,
  onFindObject,
  onMapObjectTypesChange,
}: Readonly<MapToolBarProps>) {
  return (
    <div className="relative bg-white rounded-md px-4 h-14 flex items-center justify-between">
      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-row gap-2 items-center min-w-max">
          <MapFilter onMapObjectTypesChange={onMapObjectTypesChange} />
          <MapFinder onFindObject={onFindObject} />
        </div>
      </div>

      <div className="flex flex-row gap-1 items-center pl-2">
        {canGoToHousehold && (
          <Button variant="ghost" onClick={onHouseholdClick} className="flex flex-row gap-1 items-center p-2">
            <House size={20} className="text-gray-500" />
            <span className="text-gray-500">Husholdning</span>
          </Button>
        )}
        <Button variant="ghost" onClick={onPositionClick} className="flex flex-row gap-1 items-center p-2">
          <MapPin size={20} className="text-gray-500" />
          <span className="text-gray-500">Min posisjon</span>
        </Button>
        <div className="w-5">{loading && <LoadingSpinner />}</div>
      </div>
    </div>
  );
}
