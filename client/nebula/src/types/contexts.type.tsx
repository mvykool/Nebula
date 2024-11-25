import { Project } from "./project.type";
import { User } from "./user.type";

export interface AuthContextType {
  accessToken: string;
  user: User | null;
  loginAction: (data: { username: string; password: string }) => Promise<void>;
  signupAction: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logOut: () => void;
  updateUser: (updateData: Partial<User>) => Promise<User | null>;
  fetchUserData: () => Promise<void>;
  fetchWithToken: (url: string, options?: RequestInit) => Promise<Response>;
  defaultPfp: string;
}

export interface ProjectContextType {
  createProject: (data: Project) => Promise<void>;
  fetchMyProjects: () => Promise<void>;
  fetchPublishedProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<Project | undefined>;
  myProjects: Project[] | string; // Use string for error message or loading state
  publishedProjects: Project[] | string;
  updateProject: (
    projectId: number,
    updatedData: Partial<Project>,
  ) => Promise<Project>;
  deleteProject: (projectId: number) => Promise<void>;
}
