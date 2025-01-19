import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./authProvider";
import { Page, PageContextType } from "../types/page.type";
import { useProject } from "./useProject";

interface PageContextProps {
  children: React.ReactNode;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

const PageProvider: React.FC<PageContextProps> = ({ children }) => {
  const { accessToken, fetchWithToken } = useAuth();
  const { myProjects } = useProject();
  const [myPages, setMyPages] = useState<Page[]>([]);

  const urlBase = import.meta.env.VITE_URL;

  // REQUESTS

  // CREATE PROJECT
  const createPage = useCallback(
    async (data: Page) => {
      if (!accessToken) {
        return;
      }

      try {
        const response = await fetchWithToken(`${urlBase}/pages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const res = await response.json();
          console.log("Raw response from create page:", res); // Add this
          setMyPages((prev: Page[]) => {
            console.log("Previous pages:", prev); // Add this
            console.log("Adding new page:", res); // Add this
            return [...prev, res];
          });
          return res;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [fetchWithToken, accessToken],
  );

  // FETCH MY PROJECTS
  const fetchMyPages = useCallback(
    async (id: number) => {
      try {
        const response = await fetchWithToken(`${urlBase}/pages/project/${id}`);
        if (response.ok) {
          const pages = await response.json();
          setMyPages((prevPages) => {
            if (JSON.stringify(prevPages) !== JSON.stringify(pages)) {
              return pages;
            }
            return prevPages;
          });
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch pages:", errorText);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    },
    [fetchWithToken],
  );

  const fetchPage = useCallback(
    async (id: number) => {
      console.log(id, "project");
      try {
        const response = await fetchWithToken(`${urlBase}/pages/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const pages = await response.json();
          return pages;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [fetchWithToken],
  );

  //UPDATE PROJECTS
  const updatePages = useCallback(
    async (
      pageId: number,
      updatedData: { title?: string; content?: string; parentId?: number },
    ) => {
      try {
        const response = await fetchWithToken(`${urlBase}/pages/${pageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update page");
        }

        const updatedPage = await response.json();

        // Update the state with the server response
        setMyPages((prevPages) =>
          prevPages.map((page) => (page.id === pageId ? updatedPage : page)),
        );

        return updatedPage;
      } catch (error) {
        console.error("Error updating page:", error);
        throw error;
      }
    },
    [fetchWithToken],
  );

  //DELETE PROJECTS
  const deleteAllPages = useCallback(async () => {
    try {
      const response = await fetchWithToken(`${urlBase}/pages`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const pages = await response.json();
        return pages;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [fetchWithToken]);

  const deletePages = useCallback(
    async (pageId: number) => {
      try {
        const response = await fetchWithToken(`${urlBase}/pages/${pageId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to update project");
        }
        setMyPages((prevPages) =>
          prevPages.filter((page) => page.id !== pageId),
        );
        return await response.json();
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    [fetchWithToken],
  );

  useEffect(() => {
    if (accessToken && myProjects.length > 0) {
      // Get the current project ID from the URL or state
      const currentProjectId = window.location.pathname
        .split("/")
        .find((segment) => !isNaN(Number(segment)));
      if (currentProjectId) {
        fetchMyPages(parseInt(currentProjectId, 10));
      }
    }
  }, [accessToken, fetchMyPages, myProjects]);

  return (
    <PageContext.Provider
      value={{
        createPage,
        fetchMyPages,
        myPages,
        fetchPage,
        updatePages,
        deletePages,
        deleteAllPages,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
export default PageProvider;

export const usePages = () => {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
