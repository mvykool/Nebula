import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../types/project.type";
import ProjectContent from "../components/ProjectContent";
import StarButton from "../components/starButton";
import { useAuth } from "../hooks/authProvider";
import { strings } from "../constants/strings";
import Loading from "../components/loading";
import { useGenerateGradient } from "../hooks/useGenerateColor";

const StarredProjectsView = () => {
  const gradient = useGenerateGradient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithToken } = useAuth();

  const urlBase = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchStarredProjects = async () => {
      try {
        const response = await fetchWithToken(`${urlBase}/stars/my-starred`);
        if (!response.ok) {
          throw new Error("Failed to fetch starred projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStarredProjects();
  }, [urlBase, fetchWithToken]);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bgLight dark:bg-bgDark">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark">
      <header className="border-b border-black dark:border-white sticky top-0 bg-bgLight dark:bg-bgDark flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold ml-4 md:ml-0 text-black dark:text-white">
          {strings.starred.gretting}
        </h1>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {projects.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>You haven't starred any projects yet.</p>
            <Link
              to="/explore"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              Explore projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border dark:border-gray-700 rounded-lg overflow-hidden bg-cardWhite dark:bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                {project.cover ? (
                  <img
                    src={project.cover}
                    alt={`${project.name} cover`}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div
                    style={{ background: gradient }}
                    className="w-full h-28 rounded-t-lg"
                  ></div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <Link
                      to={`/p/${project.publishedSlug}`}
                      className="text-xl font-semibold text-black dark:text-white transition-colors"
                    >
                      {project.name}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400  mt-8">
                    <div className="flex items-center">
                      {" "}
                      <img
                        src={project?.owner?.picture || "/default-avatar.png"}
                        alt={project?.owner?.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <span className="text-black text-lg md:text-sm font-semibold dark:text-gray-100">
                        {project.owner?.name}
                      </span>
                    </div>
                    <StarButton
                      projectId={project.id}
                      initialStarCount={project.starCount ?? 0}
                      urlBase={urlBase}
                      fetchWithToken={fetchWithToken}
                    />
                  </div>

                  {project.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      <ProjectContent content={project.description} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}{" "}
      </main>
    </div>
  );
};

export default StarredProjectsView;
