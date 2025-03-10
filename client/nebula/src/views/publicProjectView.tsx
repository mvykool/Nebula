import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { Project } from "../types/project.type";
import { useProject } from "../hooks/useProject";
import ProjectContent from "../components/ProjectContent";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import PublicSidebar from "../components/publicSidebar";
import { useGenerateGradient } from "../hooks/useGenerateColor";

const PublicProjectView: React.FC = () => {
  const gradient = useGenerateGradient();

  const { slug } = useParams<{ slug?: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { getPublicProjectBySlug } = useProject();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getPublicProjectBySlug(slug);
        setProject(projectData);
        console.log("Project pages:", projectData.pages);
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
      <header className="border-b z-20  top-0 flex justify-between items-center p-2">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex items-center gap-3 md:gap-8">
          <ThemeSwitcher />

          <div className="flex items-center gap-2">
            <i className="bx bxs-star text-amber-500 text-xl"></i>

            <span>{project.starCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={project.owner?.picture}
              alt="owner's picture"
              className="size-8 md:size-11 rounded-lg"
            />
            <p className="font-bold">{project.owner?.username}</p>
          </div>
        </div>
      </header>
      <PublicSidebar
        projectName={project.name}
        pages={project.pages}
        slug={slug || ""}
      />
      {project?.cover ? (
        <img
          src={project?.cover}
          alt="cover"
          className="w-full h-[30vh] md:h-[35vh] object-cover"
        />
      ) : (
        <div
          style={{ background: gradient }}
          className="  relative w-full  h-[30vh] md:h-[35vh]"
        ></div>
      )}
      <main className="max-w-4xl mx-auto p-8">
        {project.description && (
          <ProjectContent content={project.description} />
        )}
      </main>
    </div>
  );
};

export default PublicProjectView;
