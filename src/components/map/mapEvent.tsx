import type { Event } from "@/types/event";
import { useClickOutside } from "@/util/hooks";
import { AlertTriangle, Clock, X } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { Marker, Layer, Source } from "react-map-gl/maplibre";

import type { Feature } from "geojson";
import { point, circle } from "@turf/turf";
import { cn } from "@/util/cn";

export default function MapEvent({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const sourceId = useMemo(() => `event-${event.id}-radius`, [event.id]);
  const fillLayerId = useMemo(() => `event-${event.id}-radius-fill`, [event.id]);
  const outlineLayerId = useMemo(() => `event-${event.id}-radius-outline`, [event.id]);

  useClickOutside(innerRef, () => {
    setOpen(false);
  });

  const colors = useMemo(() => {
    const rgbColor = `rgb(${event.colour})`;
    const rgbaColor = (opacity: number) => `rgba(${event.colour}, ${opacity})`;

    return {
      bgColor: rgbColor,
      textColor: rgbColor,
      fillColor: rgbaColor(0.2), // Transparent fill
      borderColor: rgbaColor(0.8), // Border with opacity
    };
  }, [event]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const circleGeoJSON = useMemo(() => {
    const center = point([event.longitude, event.latitude]);
    return circle(center, event.radius, { units: "kilometers" });
  }, [event.longitude, event.latitude, event.radius]);

  return (
    <>
      {/* Radius circle */}
      <Source key={outlineLayerId} id={sourceId} type="geojson" data={circleGeoJSON as Feature}>
        <Layer
          id={fillLayerId}
          type="fill"
          paint={{
            "fill-color": colors.fillColor,
            "fill-opacity": 0.7,
          }}
        />
        <Layer
          key={outlineLayerId}
          id={outlineLayerId}
          type="line"
          paint={{
            "line-color": colors.borderColor,
            "line-width": 2,
          }}
        />
      </Source>

      {/* Event marker */}
      <Marker
        className={cn("hover:z-10", open ? "z-10" : "z-0")}
        longitude={event.longitude}
        latitude={event.latitude}
        anchor="center"
        onClick={() => setOpen(true)}>
        {open ? (
          <div
            style={{ backgroundColor: "#FFFFFF", width: "16rem", zIndex: 10 }}
            className="pl-4 pr-2 py-2 rounded-md shadow-md relative cursor-auto"
            ref={innerRef}>
            <div className="flex justify-between flex-row items-center">
              <div
                style={{ color: colors.textColor }}
                className="text-black text-base font-bold flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                {event.name}
              </div>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center text-gray-700 text-sm">
                <Clock size={14} className="mr-1" />
                Start: {formatDate(event.startTime)}
              </div>
              {event.endTime && (
                <div className="flex items-center text-gray-700 text-sm">
                  <Clock size={14} className="mr-1" />
                  Slutt: {formatDate(event.endTime)}
                </div>
              )}
              <div className="text-gray-700 text-sm">Radius: {event.radius} km</div>
              {event.recommendation && (
                <div className="text-gray-700 text-sm mt-2 p-2 bg-accent rounded-md">
                  <strong>Anbefalning:</strong> {event.recommendation}
                </div>
              )}
              {event.infoPageId && (
                <div className="mt-2">
                  <a href={`/learning/${event.infoPageId}`} className="text-primary text-sm underline">
                    Se læringsside
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: colors.bgColor,
              borderColor: "#FFFFFF",
              borderWidth: "2px",
            }}
            className="p-2 rounded-full shadow-md flex items-center justify-center z-10">
            <AlertTriangle size={18} style={{ color: "#FFFFFF" }} />
          </div>
        )}
      </Marker>
    </>
  );
}
