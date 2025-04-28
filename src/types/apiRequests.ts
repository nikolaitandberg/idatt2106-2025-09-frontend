import { MapObjectType } from "./map";

export type createMapObjectTypeRequest = Omit<MapObjectType, "id">;

export type AddUserToHouseRequest = { username: string; householdId: number };

export type AddExtraResidentRequest = {
  householdId: number;
  typeId: number;
  name: string;
};
