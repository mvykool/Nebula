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
import { Project, ProjectInput } from "../types/project.type";

interface ProjectProviderProps {
  children: React.ReactNode;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "projects";

const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { accessToken, fetchWithToken } = useAuth();
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
    async (data: ProjectInput) => {
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
          setMyProjects((prev) => [...prev, res]);
          await fetchMyProjects();
          navigate("/");
          return res;
        }
      } catch (error) {
        console.log("Error creating project:", error);
        throw error;
      }
    },
    [fetchWithToken, accessToken, navigate],
  );

  // FETCH MY PROJECTS
  const fetchMyProjects = useCallback(async () => {
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
  }, [fetchWithToken, myProjects, getLocalProjects]);

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
  }, [fetchWithToken]);

  const fetchProject = useCallback(
    async (id: string | undefined) => {
      console.log(id, "project");

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
      try {
        const response = await fetchWithToken(
          `${urlBase}/projects/${projectId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update project");
        }

        const updatedProject = await response.json();

        // Immediately fetch fresh projects data to ensure sync
        await fetchMyProjects();

        return updatedProject;
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    [fetchWithToken, fetchMyProjects],
  );

  //DELETE PROJECTS

  const deleteProject = useCallback(
    async (projectId: number) => {
      console.log("Deleting project with ID:", projectId);

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

  const getPublicProjectBySlug = useCallback(
    async (slug: string | undefined) => {
      try {
        const response = await fetchWithToken(`${urlBase}/projects/p/${slug}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error("Error fetching public project:", error);
        throw error;
      }
    },
    [urlBase, fetchWithToken],
  );

  return (
    <ProjectContext.Provider
      value={{
        createProject,
        fetchMyProjects,
        getPublicProjectBySlug,
        fetchPublishedProjects,
        setMyProjects,
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
