import CreateButton from "../../components/createButton";
import Greetings from "../../components/greeting";
import ProjectCard from "../../components/projectCard";
import { Project } from "../../types/project.type";
import * as Sentry from "@sentry/react";

interface IProject {
  projects: Project[];
}

const MyProjects = ({ projects }: IProject) => {
  return (
    <div>
      <button
        onClick={() => {
          try {
            throw new Error("This is your first error!");
          } catch (error) {
            Sentry.captureException(error);
          }
        }}
      >
        Break the world
      </button>
      <Greetings />
      {/*PROJECT SECTION*/}
      <section className="w-5/6 mx-auto m-10">
        {" "}
        <div className="ml-2">
          <CreateButton />
        </div>
        <div className="flex flex-wrap">
          {projects &&
            projects?.map((project: Project) => (
              <div key={project?.id}>
                <ProjectCard
                  projectId={project?.id}
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
