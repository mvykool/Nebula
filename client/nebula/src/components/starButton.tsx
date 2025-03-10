import { useState, useEffect } from "react";

interface StarButtonProps {
  projectId: number | undefined;
  initialStarCount: number;
  urlBase: string;
  fetchWithToken: (url: string, options?: RequestInit) => Promise<Response>;
}

const StarButton = ({
  projectId,
  initialStarCount,
  urlBase,
  fetchWithToken,
}: StarButtonProps) => {
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(initialStarCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfStarred();
  }, [projectId]);

  const checkIfStarred = async () => {
    try {
      const response = await fetchWithToken(
        `${urlBase}/stars/projects/${projectId}/has-starred`,
      );
      if (response.ok) {
        const data = await response.json();
        setIsStarred(data);
      }
    } catch (error) {
      console.error("Error checking star status:", error);
    }
  };

  const handleStarClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithToken(
        `${urlBase}/stars/projects/${projectId}`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        const { starred } = await response.json();
        setIsStarred(starred);
        setStarCount((prev) => (starred ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Error toggling star:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStarClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors
        ${
          isStarred
            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300"
            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      <i className={`bx ${isStarred ? "bxs-star" : "bx-star"}`} />
      <span>{starCount}</span>
    </button>
  );
};

export default StarButton;
