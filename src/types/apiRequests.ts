import { MapObject, MapObjectType } from "./map";

export type CreateMapObjectTypeRequest = Omit<MapObjectType, "id">;
export type CreateMapObjectRequest = Omit<MapObject, "id">;
export type EditMapObjectRequest = MapObject;
