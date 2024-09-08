import { User } from "./user.type";

export type Project = {
  name: string;
  cover: string;
  description: string;
  id: number;
  owner: User;
};
