import { useEffect, useState } from "react";
import { strings } from "../../constants/strings";
import { useProject } from "../../hooks/useProject";
import Loading from "../../components/loading";
import { Project } from "../../types/project.type";
import ExploreCard from "../../components/exploreCard";

const ExploreView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fetchPublishedProjects, publishedProjects } = useProject();

  useEffect(() => {
    const getProjects = async () => {
      await fetchPublishedProjects();
      setIsLoading(false);
    };
    getProjects();
  }, [fetchPublishedProjects]);

  return (
    <>
      <h3 className="m-20 flex justify-center text-black dark:text-white text-3xl">
        {strings.explore.gretting}
      </h3>

      {/*PROJECT SECTION*/}
      <section className="w-5/6 mx-auto m-10">
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {publishedProjects &&
              publishedProjects.map((project: Project) => (
                <div key={project?.id}>
                  <ExploreCard
                    projectId={project?.id}
                    name={project?.name}
                    cover={project?.cover}
                    owner={project?.owner}
                  />
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ExploreView;
