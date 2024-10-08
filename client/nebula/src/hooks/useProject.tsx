/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./authProvider";
import { useNavigate } from "react-router";

const ProjectContext = createContext<any>({});

const ProjectProvider = ({ children }: any) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState("");

  // REQUESTS

  // CREATE PROJECT
  const createProject = async (data: any) => {
    if (!token) {
      console.log("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const res = await response.json();
        console.log("project created: ", res);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH MY PROJECTS
  const fetchMyProjects = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projects = await response.json();
        setMyProjects(projects);
        console.log(projects);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [token]);

  const fetchProject = async (id: any) => {
    console.log(id, "project");
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projects = await response.json();
        return projects;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (token && !myProjects) {
      fetchMyProjects();
    }
  }, [token, myProjects, fetchMyProjects]);

  //UPDATE PROJECTS
  const updateProject = async (projectId: number, updatedData: any) => {
    try {
      const response = await fetch(
        `http://localhost:3000/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
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
  };

  return (
    <ProjectContext.Provider
      value={{
        createProject,
        fetchMyProjects,
        myProjects,
        fetchProject,
        updateProject,
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
