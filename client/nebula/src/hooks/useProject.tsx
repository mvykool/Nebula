import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./authProvider";
import { useNavigate } from "react-router";
import { ProjectContextType } from "../types/contexts.type";
import { Project } from "../types/project.type";

interface ProjectProviderProps {
  children: React.ReactNode;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "projects";

const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { accessToken, fetchWithToken, isAnonymous } = useAuth();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<Project[]>([]);

  const urlBase = import.meta.env.VITE_URL;

  const getLocalProjects = useCallback((): Project[] => {
    const projects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return projects ? JSON.parse(projects) : [];
  }, []);

  const saveLocalProjects = useCallback((projects: Project[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, []);

  // REQUESTS

  // CREATE PROJECT
  const createProject = useCallback(
    async (data: Project) => {
      console.log("Creating project, isAnonymous:", isAnonymous); // Debug log
      if (isAnonymous) {
        const projects = getLocalProjects();
        const newProject = {
          ...data,
          id:
            projects.length > 0
              ? Math.max(...projects.map((p) => p.id)) + 1
              : 1,
        };
        const updatedProjects = [...projects, newProject];
        saveLocalProjects(updatedProjects);
        setMyProjects(updatedProjects);
        return newProject;
      }

      try {
        const response = await fetchWithToken(`${urlBase}/projects`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const res = await response.json();
          console.log("project created: ", res);
          navigate("/");
          return res;
        }
      } catch (error) {
        console.log("Error creating project:", error);
        throw error;
      }
    },
    [fetchWithToken, accessToken, isAnonymous, navigate],
  );

  // FETCH MY PROJECTS
  const fetchMyProjects = useCallback(async () => {
    if (isAnonymous) {
      const localProjects = getLocalProjects();
      if (localProjects.length > 0) {
        setMyProjects(localProjects);
      }
    }

    console.log("dies it reach here?");
    try {
      const response = await fetchWithToken(`${urlBase}/projects`);
      if (response.ok) {
        const projects = await response.json();
        if (JSON.stringify(projects) !== JSON.stringify(myProjects)) {
          setMyProjects(projects);
          console.log(projects);
        }
      } else {
        console.error("Failed to fetch projects:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, [fetchWithToken, myProjects, getLocalProjects, isAnonymous]);

  // FETCH PUBLISHED PROJECTS
  const fetchPublishedProjects = useCallback(async () => {
    try {
      const response = await fetchWithToken(`${urlBase}/projects/published`);
      if (response.ok) {
        const projects = await response.json();
        setPublishedProjects(projects);
        console.log(projects);
      } else {
        console.error("Failed to fetch projects:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  const fetchProject = useCallback(
    async (id: string | undefined) => {
      console.log(id, "project");

      if (isAnonymous) {
        const projects = getLocalProjects();
        return projects.find((p) => p.id.toString() === id);
      }

      try {
        const response = await fetchWithToken(`${urlBase}/projects/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const projects = await response.json();
          return projects;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [fetchWithToken],
  );

  useEffect(() => {
    if (accessToken && !myProjects) {
      fetchMyProjects();
    }
  }, [accessToken, myProjects, fetchMyProjects]);

  // Clear Projects
  const clearProjects = () => {
    setMyProjects([]);
  };

  // Trigger clear on logout
  useEffect(() => {
    if (!accessToken) {
      clearProjects();
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && myProjects.length === 0) {
      fetchMyProjects();
    }
  }, [accessToken, myProjects, fetchMyProjects]);

  //UPDATE PROJECTS
  const updateProject = useCallback(
    async (projectId: string | undefined, updatedData: Partial<Project>) => {
      if (isAnonymous) {
        const projects = getLocalProjects();
        const updatedProjects = projects.map((p) =>
          p.id.toString() === projectId ? { ...p, ...updatedData } : p,
        );
        saveLocalProjects(updatedProjects);
        setMyProjects(updatedProjects);
        return updatedProjects.find((p) => p.id.toString() === projectId);
      }

      try {
        const response = await fetch(`${urlBase}/projects/${projectId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
          throw new Error("Failed to update project");
        }
        console.log(response);
        return await response.json();
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    [fetchWithToken, accessToken],
  );

  //DELETE PROJECTS

  const deleteProject = useCallback(
    async (projectId: number) => {
      console.log("Deleting project with ID:", projectId);

      if (isAnonymous) {
        const allProjects = getLocalProjects();
        console.log("Before deletion, projects:", allProjects);

        const updatedProjects = getLocalProjects().filter((p) => {
          console.log(
            `Filtering: ${p.id} (${typeof p.id}) !== ${projectId} (${typeof projectId})`,
            p.id !== Number(projectId),
          );
          return p.id !== Number(projectId); // Convert projectId to number
        });

        console.log("After deletion, projects:", updatedProjects);

        saveLocalProjects(updatedProjects);
        console.log(
          "Saved to local storage:",
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),
        );

        setMyProjects(updatedProjects);
        console.log("Updated state:", updatedProjects);

        return { success: true };
      }

      try {
        const response = await fetchWithToken(
          `${urlBase}/projects/${projectId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to update project");
        }
        return await response.json();
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    [fetchWithToken, getLocalProjects, saveLocalProjects, setMyProjects],
  );

  return (
    <ProjectContext.Provider
      value={{
        createProject,
        fetchMyProjects,
        fetchPublishedProjects,
        myProjects,
        fetchProject,
        publishedProjects,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export default ProjectProvider;

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within provider");
  }
  return context;
};
