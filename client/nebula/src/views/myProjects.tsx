import Greetings from "../components/greeting";
import ProjectCard from "../components/projectCard";
import { Project } from "../types/project.type";

interface IProject {
  projects: Project[];
}

const MyProjects = ({ projects }: IProject) => {
  return (
    <div>
      <Greetings />

      {/*PROJECT SECTION*/}
      <div className="flex flex-wrap w-5/6 mx-auto m-10">
        {projects &&
          projects.map((project: Project) => (
            <div key={project?.id}>
              <ProjectCard
                name={project?.name}
                cover={project?.cover}
                owner={project?.owner}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyProjects;
