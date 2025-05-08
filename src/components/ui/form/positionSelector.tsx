"use client";
import { useCallback, useRef } from "react";
import { cn } from "@/util/cn";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MapComponent from "@/components/map/mapComponent";
import { Button } from "@/components/ui/button";
import { MapRef, Marker } from "react-map-gl/maplibre";
import Icon from "@/components/ui/icon";
import { mapIcons } from "@/util/icons";
import { useFieldContext } from "@/util/formContext";

type Position = {
  latitude: number;
  longitude: number;
};

interface PositionSelectorProps {
  icon?: keyof typeof mapIcons;
  initialMapViewState?: Position & {
    zoom?: number;
  };
  className?: string;
}

export default function PositionSelector({ initialMapViewState, className, icon }: PositionSelectorProps) {
  const field = useFieldContext<Position>();

  const mapRef = useRef<MapRef>(null);

  const onMapLoad = useCallback(() => {
    mapRef.current?.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      field.handleChange({ latitude: lat, longitude: lng });
    });
  }, [field]);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="text-left mb-1">Velg posisjon i kart</div>
        <div className={cn("w-full p-2 border border-neutral-300 rounded-md hover:cursor-pointer", className)}>
          {field.state.value === undefined ? (
            <p className="text-sm text-neutral-500">Ingen posisjon valgt</p>
          ) : (
            <>
              {field.state.value.latitude}, {field.state.value.longitude}{" "}
            </>
          )}
        </div>
        <div className="text-red-500 text-sm">
          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
            <p>{field.state.meta.errors[0].message}</p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Velg posisjon</DialogTitle>
        <div className="w-full h-64">
          <MapComponent
            onLoad={onMapLoad}
            ref={mapRef}
            initialViewState={
              initialMapViewState && {
                latitude: initialMapViewState.latitude,
                longitude: initialMapViewState.longitude,
                zoom: initialMapViewState.zoom ?? 12,
              }
            }>
            <Marker
              longitude={field.state.value?.longitude ?? 0}
              latitude={field.state.value?.latitude ?? 0}
              anchor="center">
              {icon && <Icon className="bg-white rounded-full p-2" icon={icon} size={30} />}
            </Marker>
          </MapComponent>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <DialogClose asChild>
            <Button size="fullWidth">Velg</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
