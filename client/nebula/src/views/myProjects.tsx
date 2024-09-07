/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProjectType {
  projects: any;
}

const MyProjects = ({ projects }: ProjectType) => {
  return (
    <div>
      <h2>My projects</h2>

      {projects &&
        projects.map((project: any) => (
          <div key={project?.id}>
            <p>names: {project?.name}</p>
          </div>
        ))}
    </div>
  );
};

export default MyProjects;
