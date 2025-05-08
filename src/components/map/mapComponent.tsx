"use client";

import Map, { AttributionControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Ref } from "react";
import { MAP_STYLE_CONFIG } from "@/util/mapStyleConfig";

interface MapComponentProps {
  ref?: Ref<MapRef | null>;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  onLoad?: () => void;
  onMove?: () => void;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

export default function MapComponent({
  ref,
  initialViewState,
  onMove,
  onClick,
  onLoad,
  onKeyDown,
  children,
}: Readonly<MapComponentProps>) {
  return (
    <div
      onKeyDown={onKeyDown} // Handle keyboard events here
      style={{ width: "100%", height: "100%" }}
    >
      <Map
        onLoad={onLoad}
        onMove={onMove}
        onClick={onClick}
        initialViewState={
          initialViewState ?? {
            longitude: 9.726463,
            latitude: 60.931636,
            zoom: 5,
          }
        }
        attributionControl={false}
        ref={ref}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE_CONFIG}
      >
        <AttributionControl compact={true} position="top-left" />
        {children}
      </Map>
    </div>
  );
}
