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
