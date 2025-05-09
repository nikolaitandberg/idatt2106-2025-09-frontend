"use client";
import { House, MapPin, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import MapFilter from "./mapFilter";
import MapFinder from "./mapFinder";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { animate, motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/util/cn";

interface MapToolBarProps {
  onPositionClick?: () => void;
  onHouseholdClick?: () => void;
  onMapObjectTypesChange?: (types: number[]) => void;
  onFindObject?: (typeId: number) => Promise<void>;
  loading?: boolean;
  canGoToHousehold?: boolean;
}

export default function MapToolBar({
  loading,
  canGoToHousehold,
  onHouseholdClick,
  onPositionClick,
  onFindObject,
  onMapObjectTypesChange,
}: Readonly<MapToolBarProps>) {
  const isSmallScreen = useMediaQuery("only screen and (max-width : 768px)", {
    defaultValue: false,
    initializeWithValue: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [scope, animateScope] = useAnimate();

  useEffect(() => {
    if (!isSmallScreen) {
      animate(scope.current, { height: "85%", visibility: "visible" }, { duration: 0 });
      animateScope("div:not(.no-stagger)", { opacity: 1 }, { duration: 0 });
      return;
    }

    if (isOpen) {
      animate(scope.current, { height: "85%", visibility: "visible" }, { duration: 0.2 });
      animateScope("div:not(.no-stagger)", { opacity: 1 }, { duration: 0.2, delay: stagger(0.1) });
      return;
    }

    animate(scope.current, { height: 0, visibility: "hidden" }, { duration: 0.2 });
    animateScope("div:not(.no-stagger)", { opacity: 0 }, { duration: 0.2 });
  }, [isOpen, isSmallScreen, scope, animateScope]);

  useEffect(() => {
    if (!isSmallScreen) {
      setIsOpen(true);
    }
  }, [isSmallScreen]);

  return (
    <div className="absolute left-0 top-0 h-full w-fit px-2 flex flex-col items-center justify-center pointer-events-none">
      <div className="h-[85%]">
        <motion.div
          ref={scope}
          initial={{ height: 0, visibility: "hidden" }}
          className="relative h-fit bg-white rounded-md px-2 flex flex-col items-center justify-between py-2 pointer-events-auto">
          {isSmallScreen && (
            <div className="absolute w-full flex justify-start mb-2 visible left-1 no-stagger">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="top-2 right-2 self-start p-1 h-fit bg-white pointer-events-auto">
                {isOpen ? <X size={20} className="text-gray-500" /> : <Menu size={20} className="text-gray-500" />}
              </Button>
            </div>
          )}
          <div className={cn("flex-1 overflow-x-auto mt-1 md:mt-0")}>
            <h3 className="text-sm ml-2 md:ml-0 md:text-base font-medium text-center mb-2">Kartverktøy</h3>
            <div className="flex flex-col gap-2 md:items-center min-w-max">
              <MapFilter onMapObjectTypesChange={onMapObjectTypesChange} />
              <MapFinder onFindObject={onFindObject} />
            </div>
          </div>

          <div className="h-5">{loading && <LoadingSpinner />}</div>

          <div className="flex flex-col gap-1 items-center pl-2">
            {canGoToHousehold && (
              <Button variant="ghost" onClick={onHouseholdClick} className="flex flex-row gap-1 items-center p-2">
                <House size={20} className="text-gray-500" />
                <span className="text-gray-500">Husholdning</span>
              </Button>
            )}
            <Button variant="ghost" onClick={onPositionClick} className="flex flex-row gap-1 items-center p-2">
              <MapPin size={20} className="text-gray-500" />
              <span className="text-gray-500">Min posisjon</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
