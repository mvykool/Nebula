import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { Project } from "../types/project.type";
import { useProject } from "../hooks/useProject";
import ProjectContent from "../components/ProjectContent";

const PublicProjectView: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { getPublicProjectBySlug } = useProject();
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(true);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getPublicProjectBySlug(slug);
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, getPublicProjectBySlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-black dark:text-white">
      <header className="border-b flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">{project.name}</h1>

        <button
          type="button"
          className="rounded-full hover:bg-hover dark:hover:bg-opacity-30"
          onClick={toggleTheme}
        >
          {isDark ? (
            <i className="bx bx-moon text-xl h-8 flex justify-center items-center w-8 cursor-pointer"></i>
          ) : (
            <i className="bx bx-sun text-xl h-8 flex justify-center items-center w-8 cursor-pointer"></i>
          )}
        </button>
      </header>
      <img
        src={project?.cover}
        alt="cover"
        className="w-full h-[40vh] object-cover"
      />
      <main className="max-w-4xl mx-auto p-8">
        {project.description && (
          <ProjectContent content={project.description} />
        )}
      </main>
    </div>
  );
};

export default PublicProjectView;
