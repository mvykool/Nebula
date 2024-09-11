import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Welcome from "../components/welcome";
import { useProject } from "../hooks/useProject";
import MyProjects from "./project/myProjects";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fetchMyProjects, myProjects } = useProject();

  useEffect(() => {
    const getProjects = async () => {
      await fetchMyProjects();
      setIsLoading(false);
    };
    getProjects();
  }, [fetchMyProjects]);

  return (
    <div className="w-4/6 mx-auto">
      <Navbar />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {" "}
          {/*SET MAIN VIEW IF THERE ARE PROJECTS OR NOT*/}
          {myProjects && myProjects.length > 0 ? (
            <MyProjects projects={myProjects} />
          ) : (
            <Welcome />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
