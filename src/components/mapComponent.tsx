"use client";

import Map, { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Ref } from "react";

interface MapComponentProps {
  ref?: Ref<MapRef | null>;
  onLoad?: () => void;
  children?: React.ReactNode;
}

export default function MapComponent({ ref, onLoad, children }: MapComponentProps) {
  return (
    <Map
      onLoad={onLoad}
      initialViewState={{
        longitude: 9.726463,
        latitude: 60.931636,
        zoom: 5,
      }}
      ref={ref}
      style={{ width: "100%", height: "100%" }}
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
      {children}
    </Map>
  );
}
