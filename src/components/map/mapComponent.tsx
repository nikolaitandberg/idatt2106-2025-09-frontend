"use client";

import Map, { AttributionControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Ref } from "react";
import { MAP_STYLE_CONFIG } from "@/util/mapStyleConfig";
import { Plus, Minus } from "lucide-react";

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
  const handleZoom = (zoomChange: number) => {
    if (ref && "current" in ref && ref.current) {
      const currentZoom = ref.current.getZoom();
      ref.current.zoomTo(currentZoom + zoomChange);
    }
  };

  return (
    <div
      onKeyDown={onKeyDown} // Handle keyboard events here
      style={{ width: "100%", height: "100%", position: "relative" }}
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
      {/* Zoom controls */}
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: "5px" }}>
        <button
          onClick={() => handleZoom(1)}
          style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Minus size={16} />
        </button>
      </div>
    </div>
  );
}
