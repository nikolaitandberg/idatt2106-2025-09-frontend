export type Settings = {
  sharePositionHousehold: boolean;
  sharePositionHouseholdGroup: boolean;
  // TODO: add more settings, such as theme
};

export type UpdatePositionSharingRequest = {
  userId: number;
  sharePositionHousehold: boolean;
  sharePositionGroup: boolean;
};
