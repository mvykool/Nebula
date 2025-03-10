import { Page } from "./page.type";
import { User } from "./user.type";

export interface ProjectInput {
  name: string;
  cover?: string;
  description?: string;
  publish?: boolean;
}

export type Project = {
  name: string;
  cover: string;
  description: string;
  pages: Page[];
  id: number;
  owner?: User;
  publish?: boolean;
  publishedSlug?: string;
  starCount?: number;
};
