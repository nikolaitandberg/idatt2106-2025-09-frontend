export interface Group {
  id: number;
  name: string;
  householdsCount: number;
  membersCount: number;
}

export interface GroupDetails {
  groupId: number;
  name: string;
  description: string;
  numberOfHouseholds: number;
  numberOfMembers: number;
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