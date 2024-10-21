/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useState } from "react";

interface Iprops {
  id: string | undefined;
}

const AllPages = ({ id }: Iprops) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "undefined",
    content: "",
    project: id,
  });
  const { createPage, deletePages, myPages } = usePages();

  const goPage = async () => {
    try {
      const newPage = await createPage(data);

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

  const deletePage = async (id: any) => {
    try {
      await deletePages(id);
      console.log("page deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex justify-between my-5">
          {" "}
          <p>pages</p>{" "}
          <button onClick={goPage} type="button">
            add page
          </button>
        </div>
        {Array.isArray(myPages) && myPages.length > 0 ? (
          myPages.map((page) => (
            <div className="flex justify-between items-center" key={page.id}>
              <p>{page.title}</p>
              <button onClick={() => deletePage(page.id)}>X</button>
            </div>
          ))
        ) : (
          <p>No pages available</p>
        )}
      </div>
    </div>
  );
};

export default AllPages;
