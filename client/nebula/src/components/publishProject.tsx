import { strings } from "../constants/strings";
import { useProject } from "../hooks/useProject";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

const PublishProject = () => {
  const { projectId } = useParams();
  const { updateProject, fetchProject } = useProject();
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current project state
    const getProjectStatus = async () => {
      if (projectId) {
        const project = await fetchProject(projectId);
        setIsPublished(project?.publish || false);
        setSlug(project?.publishedSlug);
        console.log("content of project", project);
        console.log(slug);
      }
    };
    getProjectStatus();
  }, [projectId, fetchProject]);

  const togglePublish = async (): Promise<void> => {
    if (!projectId) return;

    setLoading(true);
    try {
      const updatedData = { publish: !isPublished };
      await updateProject(projectId, updatedData);
      setIsPublished(!isPublished);
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={togglePublish}
        disabled={loading}
        type="button"
        className={`px-2 py-1 flex items-center gap-2 rounded-md transition-colors
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : isPublished
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {loading ? (
          <i className="bx bx-loader-alt animate-spin"></i>
        ) : isPublished ? (
          <i className="bx bx-x-circle"></i>
        ) : (
          <i className="bx bx-rocket"></i>
        )}
        {loading
          ? "Processing..."
          : isPublished
            ? strings.sidebar.unpublish || "Unpublish"
            : strings.sidebar.publish}
      </button>

      {/* Optional: Show the public URL when published */}
      {isPublished && (
        <div className="flex flex-col text-sm bg-white p-2 rounded shadow-lg">
          <p className="text-black">Published! 🎉</p>
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View public page
          </a>
        </div>
      )}
    </>
  );
};

export default PublishProject;
