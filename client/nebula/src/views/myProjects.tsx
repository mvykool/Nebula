type Project = {
  name: string;
  cover: string;
  description: string;
  id: number;
};

interface IProject {
  projects: Project[];
}

const MyProjects = ({ projects }: IProject) => {
  return (
    <div>
      <h2>My projects</h2>

      {projects &&
        projects.map((project: Project) => (
          <div key={project?.id}>
            <p>names: {project?.name}</p>
          </div>
        ))}
    </div>
  );
};

export default MyProjects;
