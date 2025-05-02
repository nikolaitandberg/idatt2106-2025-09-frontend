"use client";

import { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapObjects, useMapObjectTypes } from "@/actions/map";
import { useEvents } from "@/actions/event";
import MapObject from "@/components/map/mapObject";
import MapEvent from "@/components/map/mapEvent";
import { useDebounce } from "use-debounce";
import { useMemo, useRef, useState } from "react";
import { MapBounds } from "@/types/map";
import MapComponent from "@/components/map/mapComponent";
import UserPositionDisplay, { UserPositionDisplayRef } from "@/components/map/userPositionDisplay";
import MapToolBar from "@/components/map/mapToolbar";
import { useMyHousehold } from "@/actions/household";
import MyHouseholdMapObject from "@/components/map/myHouseholdMapObject";

export default function Home() {
  const [bounds, setBounds] = useState<MapBounds>({} as MapBounds);
  const [debouncedBounds] = useDebounce(bounds, 100);
  const [selectedMapObjectTypes, setSelectedMapObjectTypes] = useState<number[]>([]);
  const [hasSelectedMapObjectTypes, setHasSelectedMapObjectTypes] = useState(false);

  const { data: events, isFetching: eventsIsFetching } = useEvents(debouncedBounds);
  const { data: mapObjects, isFetching: mapObjectsIsFetching } = useMapObjects(debouncedBounds);
  const { data: mapObjectTypes, isFetching: mapObjectTypesIsFetching } = useMapObjectTypes();
  const { data: myHousehold } = useMyHousehold();

  const mapRef = useRef<MapRef>(null);
  const positionRef = useRef<UserPositionDisplayRef>(null);

  const filteredMapObjects = useMemo(() => {
    if (!hasSelectedMapObjectTypes) {
      return mapObjects;
    }

    if (!mapObjectTypes) return [];

    if (selectedMapObjectTypes.length === 0) {
      return [];
    }

    return mapObjects?.filter((object) => selectedMapObjectTypes.includes(object.typeId));
  }, [JSON.stringify(mapObjects), mapObjectTypes, selectedMapObjectTypes]);

  const renderedMapObjects = useMemo(() => {
    return filteredMapObjects?.map((object) => (
      <MapObject
        key={object.id}
        object={object}
        icon={mapObjectTypes?.find((type) => type.id === object.typeId)?.icon ?? "house"}
      />
    ));
  }, [filteredMapObjects]);

  const renderedEvents = useMemo(() => {
    return events?.map((event) => <MapEvent key={event.id} event={event} />);
  }, [JSON.stringify(events)]);

  const handleMove = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      setBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLong: bounds.getWest(),
        maxLong: bounds.getEast(),
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 items-center justify-center w-full h-[90vh]">
      <div className="flex items-center justify-center bg-white px-4 pb-4 pt-2 h-full w-full n">
        <div className="w-full h-full rounded-md overflow-hidden">
          <MapComponent
            initialViewState={{
              longitude: 9.726463,
              latitude: 60.931636,
              zoom: 5,
            }}
            ref={mapRef}
            onMove={handleMove}
            onLoad={handleMove}>
            {renderedMapObjects}
            {renderedEvents}
            {myHousehold && <MyHouseholdMapObject household={myHousehold} />}
            <UserPositionDisplay
              ref={positionRef}
              onInitialPosition={(pos) => {
                mapRef.current?.flyTo({
                  center: [pos.coords.longitude, pos.coords.latitude],
                  zoom: 12,
                  animate: false,
                });
              }}
              onPositionChange={(pos) => {
                console.log("Position changed:", pos);
              }}
            />
          </MapComponent>
          <div className="absolute bottom-10 w-full left-0 px-8">
            <MapToolBar
              onMapObjectTypesChange={(setSelectedTypes) => {
                setSelectedMapObjectTypes(setSelectedTypes);
                setHasSelectedMapObjectTypes(true);
              }}
              canGoToHousehold={!!myHousehold}
              onHouseholdClick={() => {
                if (!mapRef.current) return;
                if (!myHousehold) return;
                mapRef.current.flyTo({
                  center: [myHousehold.longitude, myHousehold.latitude],
                  zoom: 15,
                  animate: true,
                  duration: 1000,
                });
              }}
              loading={eventsIsFetching || mapObjectsIsFetching || mapObjectTypesIsFetching}
              onPositionClick={() => {
                if (!mapRef.current) return;

                const position = positionRef.current?.getPosition();

                if (!position) {
                  return;
                }

                mapRef.current.flyTo({
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 15,
                  animate: true,
                  duration: 1000,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
