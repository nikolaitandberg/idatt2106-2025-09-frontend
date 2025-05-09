export type Kit = {
  id: number;
  name: string;
  description: string;
};

export type HouseholdKit = {
  householdId: number;
  kitId: number;
};

export type UpdateHouseholdKitRequest = {
  householdId: number;
  kitId: number;
};
