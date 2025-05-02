import type { Event } from "@/types/event";
import { useClickOutside } from "@/util/hooks";
import { AlertTriangle, Clock, X } from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { Marker, Layer, Source } from "react-map-gl/maplibre";

import type { Feature } from "geojson";
import { point, circle } from "@turf/turf";

export default function MapEvent({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const sourceId = useMemo(() => `event-${event.id}-radius`, [event.id]);
  const fillLayerId = useMemo(() => `event-${event.id}-radius-fill`, [event.id]);
  const outlineLayerId = useMemo(() => `event-${event.id}-radius-outline`, [event.id]);

  useClickOutside(innerRef, () => {
    setOpen(false);
  });
  // Memoize colors based on severity to prevent recalculation
  const colors = useMemo(() => {
    const getSeverityColor = (severityId: number) => {
      switch (severityId) {
        case 1:
          return "bg-yellow-500"; // Low
        case 2:
          return "bg-orange-500"; // Medium
        case 3:
          return "bg-red-500"; // High
        case 4:
          return "bg-purple-500"; // Extreme
        default:
          return "bg-gray-900"; // Unknown
      }
    };

    const fillColor = (() => {
      switch (event.severityId) {
        case 1:
          return "rgba(245, 158, 11, 0.2)"; // Yellow with transparency
        case 2:
          return "rgba(249, 115, 22, 0.2)"; // Orange with transparency
        case 3:
          return "rgba(239, 68, 68, 0.2)"; // Red with transparency
        case 4:
          return "rgba(168, 85, 247, 0.2)"; // Purple with transparency
        default:
          return "rgba(107, 114, 128, 0.2)"; // Gray with transparency
      }
    })();

    const borderColor = (() => {
      switch (event.severityId) {
        case 1:
          return "rgba(245, 158, 11, 0.8)"; // Yellow border
        case 2:
          return "rgba(249, 115, 22, 0.8)"; // Orange border
        case 3:
          return "rgba(239, 68, 68, 0.8)"; // Red border
        case 4:
          return "rgba(168, 85, 247, 0.8)"; // Purple border
        default:
          return "rgba(107, 114, 128, 0.8)"; // Gray border
      }
    })();

    return {
      bgColor: getSeverityColor(event.severityId),
      textColor: getSeverityColor(event.severityId).replace("bg-", "text-"),
      fillColor,
      borderColor,
    };
  }, [event]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Memoize the circle GeoJSON to prevent regeneration on every render
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
      <Marker longitude={event.longitude} latitude={event.latitude} anchor="center" onClick={() => setOpen(true)}>
        {open ? (
          <div className="bg-white pl-4 pr-2 py-2 rounded-md shadow-md relative cursor-auto w-64 z-10" ref={innerRef}>
            <div className="flex justify-between flex-row items-center">
              <div className="text-black text-base font-bold flex items-center">
                <AlertTriangle size={16} className={`mr-2 ${colors.textColor}`} />
                Hendelse #{event.id}
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
              <div className="text-gray-700 text-sm">Affected radius: {event.radius} km</div>
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
            className={`${colors.bgColor} p-2 rounded-full shadow-md border-2 border-white flex items-center justify-center z-10`}>
            <AlertTriangle size={18} className="text-white" />
          </div>
        )}
      </Marker>
    </>
  );
}
