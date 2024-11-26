import {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./authProvider";
import { Page, PageContextType } from "../types/page.type";

interface PageContextProps {
  children: React.ReactNode;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

const PageProvider: React.FC<PageContextProps> = ({ children }) => {
  const { accessToken, fetchWithToken } = useAuth();
  const [myPages, setMyPages] = useState<Page[]>([]);

  // REQUESTS

  // CREATE PROJECT
  const createPage = useCallback(
    async (data: Page) => {
      if (!accessToken) {
        return;
      }

      try {
        const response = await fetchWithToken("http://localhost:3000/pages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const res = await response.json();
          console.log("page created: ", res);
          setMyPages((prev: Page[]) => [...prev, res]);
          return res;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [fetchWithToken, accessToken],
  );

  // FETCH MY PROJECTS
  const fetchMyPages = useCallback(async () => {
    try {
      const response = await fetchWithToken("http://localhost:3000/pages");
      if (response.ok) {
        const pages = await response.json();
        setMyPages(pages);
        console.log(pages);
      } else {
        console.error("Failed to fetch projects:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, [fetchWithToken]);

  const fetchPage = useCallback(
    async (id: any) => {
      console.log(id, "project");
      try {
        const response = await fetchWithToken(
          `http://localhost:3000/pages/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

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
    async (pageId: number, updatedData: any) => {
      try {
        const response = await fetch(`http://localhost:3000/pages/${pageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
          throw new Error("Failed to update project");
        }
        console.log("page updated");
        return await response.json();
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
    [fetchWithToken, accessToken],
  );

  //DELETE PROJECTS

  const deletePages = useCallback(
    async (pageId: number) => {
      try {
        const response = await fetchWithToken(
          `http://localhost:3000/pages/${pageId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to update project");
        }
        setMyPages((prevPages: any) =>
          prevPages.filter((page: any) => page.id !== pageId),
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
    if (accessToken && (!myPages || myPages.length === 0)) {
      fetchMyPages();
    }
  }, [accessToken, fetchMyPages]);

  return (
    <PageContext.Provider
      value={{
        createPage,
        fetchMyPages,
        myPages,
        fetchPage,
        updatePages,
        deletePages,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
export default PageProvider;

export const usePages = () => {
  return useContext(PageContext);
};
