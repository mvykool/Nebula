/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project } from "./project.type";

export type Page = {
  id: number;
  title: string;
  content: string;
  project: Project | string;
  parent: Page | null;
  children: Page | null;
};

export interface PageContextType {
  createPage: (data: any) => Promise<Page | undefined>;
  fetchMyPages: () => Promise<void>;

  fetchPage: (id: any) => Promise<Page | undefined>;
  myPages: Page[];
  updatePages: (pageId: any, updatedData: Partial<Page>) => Promise<Page>;
  deletePages: (pageId: number) => Promise<void>;
}
