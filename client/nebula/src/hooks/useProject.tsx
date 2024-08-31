/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, createContext } from "react";
import { useAuth } from "./authProvider";

const ProjectContext = createContext<any>({});

const ProjectProvider = ({ children }: any) => {

  const { token } = useAuth();

  // REQUESTS 

  // CREATE PROJECT
  const createProject = async (data: any) => {

    if (!token) {
      console.log('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/project', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const res = await response.json();
        console.log('project created: ', res)
      }

    } catch (error) {

      console.log(error)
    }

  };

  return (
    <ProjectContext.Provider value={{ createProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
export default ProjectProvider;

export const useProject = () => {
  return useContext(ProjectContext);
};
