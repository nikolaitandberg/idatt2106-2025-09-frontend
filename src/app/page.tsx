"use client";

import { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapObjects, useMapObjectTypes } from "@/actions/map";
import { useEvents } from "@/actions/event";
import MapObject from "@/components/map/mapObject";
import MapEvent from "@/components/map/mapEvent";
import { useDebounce } from "use-debounce";
import { useMemo, useRef, useState } from "react";
import { MapBounds } from "@/types/map";
import MapComponent from "@/components/map/mapComponent";

export default function Home() {
  const [bounds, setBounds] = useState<MapBounds>({} as MapBounds);
  const [debouncedBounds] = useDebounce(bounds, 100);

  const { data: events } = useEvents(debouncedBounds);
  const { data: mapObjects } = useMapObjects(debouncedBounds);
  const { data: mapObjectTypes } = useMapObjectTypes();
  const mapRef = useRef<MapRef>(null);

  const renderedMapObjects = useMemo(() => {
    return mapObjects?.map((object) => (
      <MapObject
        key={object.id}
        object={object}
        icon={mapObjectTypes?.find((type) => type.id === object.typeId)?.icon ?? "house"}
      />
    ));
  }, [JSON.stringify(mapObjects)]);

  const renderedEvents = useMemo(() => {
    return events?.map((event) => <MapEvent key={event.id} event={event} />);
  }, [JSON.stringify(events)]);

  const handleMove = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      setBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLong: bounds.getWest(),
        maxLong: bounds.getEast(),
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 items-center justify-center w-full h-[90vh]">
      <div className="flex items-center justify-center bg-white px-4 pb-4 pt-2 h-full w-full n">
        <div className="w-full h-full rounded-md overflow-hidden">
          <MapComponent
            initialViewState={{
              longitude: 9.726463,
              latitude: 60.931636,
              zoom: 5,
            }}
            ref={mapRef}
            onMove={handleMove}
            onLoad={handleMove}>
            {renderedMapObjects}
            {renderedEvents}
          </MapComponent>
        </div>
      </div>
    </div>
  );
}
