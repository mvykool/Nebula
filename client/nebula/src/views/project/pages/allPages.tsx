/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useState } from "react";
import { strings } from "../../../constants/strings";

interface Iprops {
  id: string | undefined;
  name: string | undefined;
}

const AllPages = ({ id, name }: Iprops) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "title",
    content: "",
    project: id,
  });
  const { createPage, deletePages, myPages, fetchMyPages } = usePages();

  const addPage = async () => {
    try {
      const newPage: any = await createPage(data);

      if (newPage && newPage.id) {
        console.log(newPage);
        setData(newPage);
        console.log(`projects/${id}/pages/${newPage.id}`);
        navigate(`pages/${newPage.id}`);
      }
    } catch (error) {
      console.log(error);
    }
    return;
  };

  const project = () => {
    navigate(`/projects/${id}`);
  };

  const deletePage = async (id: any) => {
    try {
      await deletePages(id);
      console.log("page deleted");
      fetchMyPages();
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
