"use client";

import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import type { Feature, FeatureCollection } from "geojson";
import { showToast } from "../ui/toaster";
import { circle, point } from "@turf/turf";

export interface UserPositionDisplayRef {
  getPosition: () => GeolocationPosition | null;
}

interface UserPositionDisplayProps {
  onPositionChange?: (position: GeolocationPosition) => void;
  onInitialPosition?: (position: GeolocationPosition) => void;
  ref?: RefObject<UserPositionDisplayRef | null>;
}

export default function UserPositionDisplay({ ref, onPositionChange, onInitialPosition }: UserPositionDisplayProps) {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [updateUserPosition, setUpdateUserPosition] = useState(true);
  const [navigatorWatchId, setNavigatorWatchId] = useState<number | null>(null);
  const isInitialPosition = useRef(true);

  useEffect(() => {
    if (!ref) return;

    ref.current = {
      getPosition: () => {
        if (updateUserPosition) {
          return position;
        }

        setUpdateUserPosition(true);
        return null;
      },
    };
  }, [position, ref, updateUserPosition]);

  useEffect(() => {
    if (!("permissions" in navigator)) return;

    navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
      if (permissionStatus.state === "granted") {
        setUpdateUserPosition(true);
      }

      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          showToast({
            title: "Geolokalisering aktivert",
            description: "Geolokalisering er aktivert. Du kan nå se posisjonen din.",
            variant: "success",
          });
          setUpdateUserPosition(true);
        }
      };
    });
  }, []);

  useEffect(() => {
    if (!navigatorWatchId) return;
    if (updateUserPosition) return;

    navigator.geolocation.clearWatch(navigatorWatchId);
  }, [navigatorWatchId, updateUserPosition]);

  const handlePosition = (newPosition: GeolocationPosition) => {
    if (isInitialPosition.current) {
      onInitialPosition?.(newPosition);
    } else {
      onPositionChange?.(newPosition);
    }

    isInitialPosition.current = false;
    setPosition(newPosition);
  };

  const handleError = (e: GeolocationPositionError) => {
    setUpdateUserPosition(false);
    if (e.code === GeolocationPositionError.PERMISSION_DENIED) {
      showToast({
        title: "Geolokalisering avbrutt",
        description:
          "Du har avvist forespørselen om geolokalisering. For å se posisjonen din må du gi tillatelse i nettleserinnstillingene dine.",
        variant: "warning",
      });
      return;
    }

    if (e.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
      showToast({
        title: "Geolokalisering utilgjengelig",
        description: "Vi kunne ikke hente posisjonen din. Vennligst sjekk innstillingene dine eller prøv igjen senere.",
        variant: "error",
      });
      return;
    }

    if (e.code === GeolocationPositionError.TIMEOUT) {
      showToast({
        title: "Geolokalisering timeout",
        description: "Geolokalisering tok for lang tid. Prøv igjen senere.",
        variant: "error",
      });
      return;
    }

    showToast({
      title: "Geolokalisering feil",
      description: "Det oppstod en feil under geolokalisering.",
      variant: "error",
    });
  };

  useEffect(() => {
    if (!updateUserPosition) return;

    if (!("geolocation" in navigator)) {
      showToast({
        title: "Kunne ikke hente posisjon",
        description: "Geolokalisering støttes ikke av nettleseren din.",
        variant: "error",
      });
    }

    const watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });

    setNavigatorWatchId(watchId);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [updateUserPosition]);

  const geojson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [position?.coords.longitude, position?.coords.latitude] },
          properties: null,
        },
      ],
    } as FeatureCollection;
  }, [position]);

  const accuracyGeoJson = useMemo(() => {
    if (!position) {
      return undefined;
    }

    const center = point([position?.coords.longitude, position?.coords.latitude]);
    return circle(center, position.coords.accuracy, { units: "meters" });
  }, [position]);

  if (!updateUserPosition) {
    return null;
  }

  return (
    <>
      <Source id="user-position" type="geojson" data={geojson}>
        <Layer
          id="user-position-point"
          type="circle"
          paint={{
            "circle-radius": 10,
            "circle-color": "#007cbf",
          }}
        />
      </Source>
      {accuracyGeoJson && (
        <Source id="user-position-accuracy" type="geojson" data={accuracyGeoJson as Feature}>
          <Layer
            id="user-position-accuracy"
            type="fill"
            paint={{
              "fill-color": "#007cbf",
              "fill-opacity": 0.2,
            }}
          />
        </Source>
      )}
    </>
  );
}
