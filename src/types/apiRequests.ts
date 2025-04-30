import { Food, Household } from "./household";
import { MapObject, MapObjectType } from "./map";

export type CreateMapObjectTypeRequest = Omit<MapObjectType, "id">;

export type AddUserToHouseRequest = { userId: string };

export type AddExtraResidentRequest = {
  householdId: number;
  typeId: number;
  name: string;
};
export type CreateMapObjectRequest = Omit<MapObject, "id">;
export type EditMapObjectRequest = MapObject;

export type AddHouseholdFoodRequest = Omit<Food, "id">;
export type EditHouseholdInfoRequest = Omit<Household, "waterAmountLiters" | "lastWaterChangeDate">;
