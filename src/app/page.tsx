"use client";

import Map, { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapObjects, useMapObjectTypes } from "@/actions/map";
import MapObject from "@/components/map/mapObject";
import { useDebounce } from "use-debounce";
import { useMemo, useRef, useState } from "react";
import { MapBounds } from "@/types/map";

export default function Home() {
  const [bounds, setBounds] = useState<MapBounds>({} as MapBounds);
  const [debouncedBounds] = useDebounce(bounds, 100);

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
    <div className="flex items-center justify-center bg-background px-4 h-[80vh]">
      <Map
        initialViewState={{
          longitude: 9.726463,
          latitude: 60.931636,
          zoom: 5,
        }}
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        onMove={handleMove}
        onLoad={handleMove}
        mapStyle={{
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        }}>
        {renderedMapObjects}
      </Map>
    </div>
  );
}
