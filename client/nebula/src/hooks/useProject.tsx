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

const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { accessToken, fetchWithToken } = useAuth();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState("");
  const [publishedProjects, setPublishedProjects] = useState("");

  // REQUESTS

  // CREATE PROJECT
  const createProject = useCallback(
    async (data: Project) => {
      if (!accessToken) {
        return;
      }

      try {
        const response = await fetchWithToken(
          "http://localhost:3000/projects",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        if (response.ok) {
          const res = await response.json();
          console.log("project created: ", res);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [fetchWithToken, accessToken],
  );

  // FETCH MY PROJECTS
  const fetchMyProjects = useCallback(async () => {
    try {
      const response = await fetchWithToken("http://localhost:3000/projects");
      if (response.ok) {
        const projects = await response.json();
        setMyProjects(projects);
        console.log(projects);
      } else {
        console.error("Failed to fetch projects:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  // FETCH PUBLISHED PROJECTS
  const fetchPublishedProjects = useCallback(async () => {
    try {
      const response = await fetchWithToken(
        "http://localhost:3000/projects/published",
      );
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
    async (id: string) => {
      console.log(id, "project");
      try {
        const response = await fetchWithToken(
          `http://localhost:3000/projects/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

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

  //UPDATE PROJECTS
  const updateProject = useCallback(
    async (projectId: number, updatedData: Partial<Project>) => {
      try {
        const response = await fetch(
          `http://localhost:3000/projects/${projectId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedData),
          },
        );
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
      try {
        const response = await fetchWithToken(
          `http://localhost:3000/projects/${projectId}`,
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
    [fetchWithToken],
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
  return useContext(ProjectContext);
};
