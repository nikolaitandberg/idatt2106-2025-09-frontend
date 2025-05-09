import type { MapObject } from "@/types/map";
import { useClickOutside } from "@/util/hooks";
import { Clock, Mail, PhoneCall, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import Icon from "../ui/icon";
import { mapIcons } from "@/util/icons";
import { cn } from "@/util/cn";

export default function MapObject({
  object,
  icon,
  typeName,
}: Readonly<{
  object: MapObject;
  icon: keyof typeof mapIcons;
  typeName?: string;
}>) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useClickOutside(innerRef, () => {
    setOpen(false);
  });

  return (
    <Marker
      longitude={object.longitude}
      latitude={object.latitude}
      anchor="center"
      onClick={() => setOpen(true)}
      className={cn("hover:z-10", open ? "z-10" : "z-0")}>
      {open ? (
        <div className="w-52 md:w-xs bg-white pl-4 pr-2 py-2 rounded-md relative cursor-auto shadow-2xl" ref={innerRef}>
          <div className="flex justify-between flex-row items-center">
            <div className="text-black text-base ">{object.description}</div>
            <X onClick={() => setOpen(false)} className="cursor-pointer" />
          </div>
          <div className="flex flex-row items-center gap-2">
            <Icon icon={icon} size={20} className="text-gray-500" />
            <div className="text-gray-500 text-sm">{typeName}</div>
          </div>
          <div className="flex flex-col">
            {object.contactPhone && (
              <div className="flex flex-row items-center gap-2 mt-2">
                <PhoneCall size={15} />
                <div className="text-gray-500 text-sm">{object.contactPhone}</div>
              </div>
            )}
            {object.contactPhone && (
              <div className="flex flex-row items-center gap-2 mt-2">
                <Mail size={15} />
                <div className="text-gray-500 text-sm">{object.contactEmail}</div>
              </div>
            )}
            {object.contactEmail && (
              <div className="flex flex-row items-center gap-2 mt-2">
                <User size={15} />
                <div className="text-gray-500 text-sm">{object.contactName}</div>
              </div>
            )}
            {object.opening && object.closing && (
              <div className="flex flex-row items-center gap-2 mt-2">
                <Clock size={15} />
                <div className="text-gray-500 text-sm flex flex-row items-center">
                  {new Date(object.opening).getUTCHours()} - {new Date(object.closing).getUTCHours()}
                </div>
              </div>
            )}
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
