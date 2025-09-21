import type { Date } from "mongoose";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  city: string;
  active: boolean;
  lastLogin: Date;
}
