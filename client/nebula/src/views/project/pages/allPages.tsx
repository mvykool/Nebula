/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useEffect, useState } from "react";
import { strings } from "../../../constants/strings";

interface Iprops {
  projectId: string | undefined;
  name: string | undefined;
}

const AllPages = ({ projectId, name }: Iprops) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "title",
    content: "",
    projectId: projectId ? parseInt(projectId, 10) : undefined,
  });

  const { createPage, deletePages, myPages, fetchMyPages } = usePages();

  useEffect(() => {
    if (projectId) {
      const numericProjectId = parseInt(projectId, 10);
      console.log("Fetching pages for project:", numericProjectId);
      fetchMyPages(numericProjectId);
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
            className="bg-gray-500 bg-opacity-50 px-2 py-1 rounded-md"
            type="button"
          >
            {strings.sidebar.addPage}
          </button>
        </div>
        {Array.isArray(myPages) && myPages.length > 0
          ? myPages.map((page) => (
              <div
                className="flex justify-between hover:bg-gray-700 items-center ml-3 p-2 rounded-sm"
                key={page.id}
              >
                <p className="text-gray-300" onClick={() => goPage(page.id)}>
                  {page.title}
                </p>
                <button onClick={() => deletePage(page.id)}>
                  <i className="bx bxs-x-square text-gray-300 text-xl"></i>
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default AllPages;
