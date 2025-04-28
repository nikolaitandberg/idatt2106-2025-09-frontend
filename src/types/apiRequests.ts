import { MapObject, MapObjectType } from "./map";

export type CreateMapObjectTypeRequest = Omit<MapObjectType, "id">;

export type AddUserToHouseRequest = { username: string; householdId: number };

export type AddExtraResidentRequest = {
  householdId: number;
  typeId: number;
  name: string;
};
export type CreateMapObjectRequest = Omit<MapObject, "id">;
export type EditMapObjectRequest = MapObject;
