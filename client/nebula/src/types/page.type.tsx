import { Project } from "./project.type";

export type Page = {
  title: string;
  content: string;
  project: Project;
  parent: Page;
  children: Page;
};
