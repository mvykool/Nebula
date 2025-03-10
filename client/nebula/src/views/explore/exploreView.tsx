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
      console.log(publishedProjects);
      setIsLoading(false);
    };
    getProjects();
  }, [fetchPublishedProjects]);

  return (
    <>
      <header className="border-b border-black dark:border-white sticky top-0 bg-bgLight dark:bg-bgDark flex justify-between items-center py-5">
        <h2 className="text-2xl w-full font-bold ml-4 md:ml-0 text-black dark:text-white">
          {strings.explore.gretting}
        </h2>
      </header>

      {/*PROJECT SECTION*/}
      <section className="w-5/6 md:w-3/6 mx-auto m-10">
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {publishedProjects &&
              publishedProjects.map((project: Project) => (
                <div key={project?.id}>
                  <ExploreCard project={project} owner={project?.owner} />
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ExploreView;
