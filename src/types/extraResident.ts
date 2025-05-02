export type ExtraResidentType = {
  id: number;
  name: string;
  consumptionWater: number;
  consumptionFood: number;
};

export type ExtraResidentResponse = {
  id: number;
  householdId: number;
  typeId: number;
  name: string;
};
