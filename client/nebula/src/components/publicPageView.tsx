/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useParams } from "react-router";
import ProjectContent from "./ProjectContent";
import PublicSidebar from "./publicSidebar";
import { useEffect, useState } from "react";

import { useProject } from "../hooks/useProject";
import { Project } from "../types/project.type";

const PublicPageView = () => {
  const { slug, pageId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { getPublicProjectBySlug } = useProject();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getPublicProjectBySlug(slug);
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, pageId]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <Navigate to="/" />;

  const currentPage = project.pages.find(
    (page: any) => page.id === Number(pageId),
  );
  if (!currentPage) return <Navigate to={`/p/${slug}`} />;

  return (
    <div className="flex min-h-screen bg-bgLight dark:bg-bgDark text-black dark:text-white">
      <PublicSidebar
        projectName={project.name}
        pages={project.pages}
        slug={slug || ""}
      />

      <div className="flex-1">
        <header className="border-b p-5">
          <h1 className="text-2xl font-bold">{currentPage.title}</h1>
        </header>

        <main className="max-w-4xl mx-auto p-8">
          <ProjectContent content={currentPage.content} />
        </main>
      </div>
    </div>
  );
};

export default PublicPageView;
