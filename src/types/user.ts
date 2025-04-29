export interface User {
  id: number;
  householdId: number;
  email: string;
  username: string;
  password: string;
  emailConfirmed: boolean;
  firstName: string;
  lastName: string;
  sharePositionHousehold: boolean;
  sharePositionGroup: boolean;
  picture: string;
  admin: boolean;
  superAdmin: boolean;
}
