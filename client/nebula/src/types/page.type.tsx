import { Project } from "./project.type";

export type Page = {
  id: number;
  title: string;
  content: string;
  project: Project;
  parent: Page;
  children: Page;
};

export interface PageContextType {
  createPage: (data: Page) => Promise<Page | undefined>;
  fetchMyPages: () => Promise<void>;
  fetchPage: (id: number) => Promise<Page | undefined>;
  myPages: Page[]; // Array of Page objects
  updatePages: (pageId: number, updatedData: Partial<Page>) => Promise<Page>;
  deletePages: (pageId: number) => Promise<void>;
}
