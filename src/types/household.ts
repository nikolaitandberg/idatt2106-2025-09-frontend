export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
  picture: string;
}

export type Household = {
  id: number;
  address: string;
  name: string;
  longitude: number;
  latitude: number;
  waterAmountLiters: number;
  lastWaterChangeDate: string;
  levelOfPreparedness: {
    levelOfPreparedness: number;
    levelOfPreparednessFood: number;
    levelOfPreparednessKit: number;
    levelOfPreparednessWater: number;
  };
};

export type FoodType = {
  id: number;
  name: string;
  unit: string;
  caloriesPerUnit: number;
  picture: string;
};

export type Food = {
  id: number;
  typeId: number;
  householdId: number;
  expirationDate: string;
  amount: number;
};

export type FoodSummary = Omit<FoodType, "id" | "name"> & {
  typeId: number;
  typeName: string;
  totalAmount: number;
  totalCalories: number;
  batches: Omit<Food, "typeId" | "householdId">[];
};

export interface HouseholdGroupMember {
  id: number;
  name: string;
  address: string;
  peopleCount: number;
  isHome?: boolean;
}
