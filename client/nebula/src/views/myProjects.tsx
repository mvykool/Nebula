import CreateButton from "../components/createButton";
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
      <section className="w-5/6 mx-auto m-10">
        {" "}
        <div className="ml-2">
          <CreateButton />
        </div>
        <div className="flex flex-wrap">
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
      </section>
    </div>
  );
};

export default MyProjects;
