import { Page } from "./page.type";
import { User } from "./user.type";

export type Project = {
  name: string;
  cover: string;
  description: string;
  pages: Page[];
  id: number;
  owner?: User;
};
