import { useEffect, useState } from "react";
import Welcome from "../components/welcome";
import { useProject } from "../hooks/useProject";
import MyProjects from "./project/myProjects";
import Loading from "../components/loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fetchMyProjects, myProjects } = useProject();

  useEffect(() => {
    const getProjects = async () => {
      await fetchMyProjects();
      setIsLoading(false);
    };
    getProjects();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div>
          {" "}
          {/*SET MAIN VIEW IF THERE ARE PROJECTS OR NOT*/}
          {myProjects.length > 0 ? (
            <MyProjects projects={myProjects} />
          ) : (
            <Welcome />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
