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
  longitude: number;
  latitude: number;
  waterAmountLiters: number;
  lastWaterChangeDate: string;
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

export type FoodWithType = FoodType & {
  food: Food[];
};
