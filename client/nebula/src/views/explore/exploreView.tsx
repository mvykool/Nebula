import { useEffect, useState } from "react";
import { strings } from "../../constants/strings";
import { useProject } from "../../hooks/useProject";
import Loading from "../../components/loading";
import { Project } from "../../types/project.type";

const ExploreView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fetchPublishedProjects, publishedProjects } = useProject();

  useEffect(() => {
    const getProjects = async () => {
      await fetchPublishedProjects();
      setIsLoading(false);
    };
    getProjects();
  }, []);

  return (
    <>
      <h3>{strings.explore.gretting}</h3>

      {/*PROJECT SECTION*/}
      <section className="w-5/6 mx-auto m-10">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap">
            {publishedProjects &&
              publishedProjects.map((project: Project) => (
                <div key={project?.id}>
                  <p>{project?.name}</p>
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ExploreView;
