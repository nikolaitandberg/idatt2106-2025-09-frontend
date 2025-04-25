import type { MapObject } from "@/types/map";
import { House } from "lucide-react";
import { Marker } from "react-map-gl/maplibre";

export default function MapObject({ object }: { object: MapObject }) {
  return (
    <Marker longitude={object.longitude} latitude={object.latitude}>
      <div className="bg-white p-1 rounded-full shadow-md">
        <House />
      </div>
    </Marker>
  );
}
