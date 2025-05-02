import { House, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import MapFilter from "./mapFilter";

interface MapToolBarProps {
  onPositionClick?: () => void;
  onHouseholdClick?: () => void;
  onMapObjectTypesChange?: (types: number[]) => void;
  loading?: boolean;
  canGoToHousehold?: boolean;
}

export default function MapToolBar({
  loading,
  canGoToHousehold,
  onHouseholdClick,
  onPositionClick,
  onMapObjectTypesChange,
}: Readonly<MapToolBarProps>) {
  return (
    <div className="flex flex-row gap-2 justify-center items-center bg-white rounded-md px-4 h-14 relative">
      <div>
        <MapFilter onMapObjectTypesChange={onMapObjectTypesChange} />
      </div>
      <div className="flex flex-row gap-1 items-center absolute right-2 top-0 h-full">
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
