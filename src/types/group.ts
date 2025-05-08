export interface Group {
  id: number;
  name: string;
  numberOfHouseholds: number;
  numberOfMembers: number;
}

export interface GroupDetails {
  groupId: number;
  groupName: string;
  groupDescription: string;
  totalHouseholds: number;
  totalResidents: number;
  totalExtraResidents: number;
}

export interface GroupHouseholdRelation {
  id: number;
  householdId: number;
  groupId: number;
}

export interface GroupHousehold {
  id: number;
  householdId: number;
  groupId: number;
  name: string;
  address: string;
  peopleCount: number;
  petCount?: number;
}

export interface EditGroupRequest {
  id: number;
  name: string;
  description: string;
}

export type SharedFoodResponse = {
  typeId: number;
  typeName: string;
  unit: string;
  totalAmount: number;
  totalCalories: number;
  batches: {
    id: number;
    amount: number;
    expirationDate: string;
    householdId: number;
  }[];
};

export type ShareFoodRequest = {
  foodId: number;
  groupHouseholdId: number;
  amount: number;
};

export type GroupInviteRequest = {
  householdId: number;
  groupId: number;
};

export type GroupInvite = {
  groupId: number;
  householdId: number;
};

export type SharedFoodSummary = {
  typeId: number;
  typeName: string;
  unit: string;
  totalAmount: number;
};

export type SharedFoodByHousehold = {
  typeId: number;
  typeName: string;
  unit: string;
  totalAmount: number;
  totalCalories: number;
  batches: {
    id: number;
    amount: number;
    expirationDate: string;
    householdId: number;
    groupHouseholdId: number;
  }[];
};

export type MoveFoodArgs = {
  foodId: number;
  groupId: number;
  amount: number;
};