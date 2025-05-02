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
