import type { MapObject } from "@/types/map";
import { useClickOutside } from "@/util/hooks";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import Icon from "../ui/icon";
import { mapIcons } from "@/util/icons";

export default function MapObject({ object, icon }: { object: MapObject; icon: keyof typeof mapIcons }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useClickOutside(innerRef, () => {
    setOpen(false);
  });

  return (
    <Marker longitude={object.longitude} latitude={object.latitude} anchor="center" onClick={() => setOpen(true)}>
      {open ? (
        <div className="bg-white pl-4 pr-2 py-2 rounded-md shadow-md relative cursor-auto" ref={innerRef}>
          <div className="flex justify-between flex-row items-center">
            <div className="text-black text-base ">{object.description}</div>
            <X onClick={() => setOpen(false)} className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <div className="text-gray-500 text-sm">{object.typeId}</div>
            <div className="text-gray-500 text-sm">{object.contactEmail}</div>
            <div className="text-gray-500 text-sm">{object.contactName}</div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-1 rounded-full shadow-md">
          <Icon icon={icon} size={24} />
        </div>
      )}
    </Marker>
  );
}
