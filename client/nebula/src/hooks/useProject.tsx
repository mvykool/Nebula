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
  const [selectedProject, setSelectedProject] = useState("");

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

  //STORE PROJECT SELECTED
  const pickProject = (project: any) => {
    setSelectedProject(project);
  };

  useEffect(() => {
    if (token && !myProjects) {
      fetchMyProjects();
    }
  }, [token, myProjects, fetchMyProjects]);

  return (
    <ProjectContext.Provider
      value={{
        createProject,
        fetchMyProjects,
        myProjects,
        pickProject,
        selectedProject,
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
