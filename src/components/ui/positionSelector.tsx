"use client";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/util/cn";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import MapComponent from "../mapComponent";
import { Button } from "./button";
import { MapRef, Marker } from "react-map-gl/maplibre";
import Icon from "./icon";
import { mapIcons } from "@/util/icons";

type Position = {
  latitude: number;
  longitude: number;
};

interface PositionSelectorProps {
  initialPosition?: Position;
  icon?: keyof typeof mapIcons;
  onChange: (position: Position) => void;
  className?: string;
}

export default function PositionSelector({ initialPosition, className, icon, onChange }: PositionSelectorProps) {
  const [latitude, setLatitude] = useState(initialPosition?.latitude ?? 0);
  const [longitude, setLongitude] = useState(initialPosition?.longitude ?? 0);

  const mapRef = useRef<MapRef>(null);

  const onMapLoad = useCallback(() => {
    mapRef.current?.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setLatitude(lat);
      setLongitude(lng);
      onChange({ latitude: lat, longitude: lng });
    });
  }, [onChange]);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="text-left mb-1">Velg posisjon</div>
        <div className={cn("w-full p-2 border border-neutral-300 rounded-md hover:cursor-pointer", className)}>
          {latitude}, {longitude}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Velg posisjon</DialogTitle>
        <div className="w-full h-64">
          <MapComponent onLoad={onMapLoad} ref={mapRef} initialViewState={{ latitude, longitude, zoom: 12 }}>
            <Marker longitude={longitude} latitude={latitude} anchor="center">
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
