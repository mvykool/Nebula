/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useEffect, useState } from "react";
import { strings } from "../../../constants/strings";
import { Page } from "../../../types/page.type";

interface Iprops {
  projectId: string | undefined;
  name: string | undefined;
}

const AllPages = ({ projectId, name }: Iprops) => {
  const navigate = useNavigate();
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());
  const [data, setData] = useState({
    title: "title",
    content: "",
    projectId: projectId ? parseInt(projectId, 10) : undefined,
    parentId: null as number | null,
  });

  const { createPage, deletePages, myPages, fetchMyPages } = usePages();

  useEffect(() => {
    if (projectId) {
      const numericProjectId = parseInt(projectId, 10);
      console.log("Fetching pages for project:", numericProjectId);
      fetchMyPages(numericProjectId).then(() => {
        // Expand all parent pages that have children
        if (Array.isArray(myPages)) {
          const parentsWithChildren = myPages
            .filter((page) => page.children && page.children.length > 0)
            .map((page) => page.id);
          setExpandedPages(new Set(parentsWithChildren));
        }
      });
    }
  }, [projectId, fetchMyPages]);

  const addPage = async () => {
    if (!projectId) {
      console.error("No project ID provided");
      return;
    }

    const numericProjectId = parseInt(projectId, 10);
    const pageData = {
      ...data,
      projectId: numericProjectId,
    };

    try {
      console.log("Creating page with data:", pageData);
      const newPage = await createPage(pageData);
      if (newPage && newPage.id) {
        console.log("New page created:", newPage);
        await fetchMyPages(numericProjectId); // Refresh the pages list
        setData(pageData);
        navigate(`pages/${newPage.id}`);
      }
    } catch (error) {
      console.log("Error creating page:", error);
    }
  };

  const project = () => {
    navigate(`/projects/${projectId}`);
  };

  const deletePage = async (id: any) => {
    try {
      await deletePages(id);
      console.log("page deleted");
      if (projectId) {
        await fetchMyPages(parseInt(projectId, 10)); // Convert to number
      }
      project();
    } catch (error) {
      console.log(error);
    }
  };

  const goPage = (id: number) => {
    navigate(`pages/${id}`);
  };

  const toggleExpand = (pageId: number) => {
    setExpandedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const addChildPage = async (parentId: number) => {
    if (!projectId) {
      console.error("No project ID provided");
      return;
    }
    const numericProjectId = parseInt(projectId, 10);
    const pageData = {
      ...data,
      projectId: numericProjectId,
      parentId: parentId,
    };
    try {
      const newPage = await createPage(pageData);
      if (newPage && newPage.id) {
        // Automatically expand the parent page
        setExpandedPages((prev) => new Set([...prev, parentId]));
        await fetchMyPages(numericProjectId);
        navigate(`pages/${newPage.id}`);
      }
    } catch (error) {
      console.log("Error creating child page:", error);
    }
  };

  const renderPage = (page: Page, level: number = 0) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);

    return (
      <div key={page.id} className="flex flex-col">
        <div
          className="flex justify-between hover:bg-cardWhite dark:hover:bg-card text-black dark:text-gray-200 items-center p-2 rounded-md"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(page.id)}
                className=" w-4 h-4 flex items-center justify-center"
              >
                <i
                  className={`bx bx-chevron-${isExpanded ? "down" : "right"} text-lg`}
                ></i>
              </button>
            )}
            <p className=" w-36 cursor-pointer" onClick={() => goPage(page.id)}>
              {page.title}
            </p>
          </div>
          <div className="flex gap-2">
            {level === 0 && (
              <button
                onClick={() => addChildPage(page.id)}
                className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-gray-100"
                title="Add subpage"
              >
                <i className="bx bx-plus"></i>
              </button>
            )}
            <button
              onClick={() => deletePage(page.id)}
              className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-gray-100"
              title="Delete page"
            >
              <i className="bx bxs-x-square text-xl"></i>
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {page?.children?.map((childPage) =>
              renderPage(childPage, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex justify-between mb-8 items-center">
          {" "}
          <button onClick={project} className="font-bold text-lg tracking-wide">
            {name}
          </button>{" "}
          <button
            onClick={addPage}
            className="bg-gray-500 text-sm bg-opacity-50 px-2 py-1 rounded-md"
            type="button"
          >
            {strings.sidebar.addPage}
          </button>
        </div>
        {Array.isArray(myPages) && myPages.length > 0
          ? myPages
              .filter((page) => !page.parent) // Only render top-level pages
              .map((page) => renderPage(page))
          : null}
      </div>
    </div>
  );
};

export default AllPages;
