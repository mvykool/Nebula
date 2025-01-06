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
  fetchProject: (id: string | undefined) => Promise<Project | undefined>;
  myProjects: Project[];
  publishedProjects: Project[];
  updateProject: (
    projectId: string,
    updatedData: Partial<Project>,
  ) => Promise<Project>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteProject: (projectId: any) => Promise<void>;
}
