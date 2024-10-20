/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useState } from "react";

interface Iprops {
  pages: any;
  id: string | undefined;
}

const AllPages = ({ pages, id }: Iprops) => {
  const navigate = useNavigate();
  const [data] = useState({
    title: "undefined",
    content: "",
    project: id,
  });
  const { createPage, deletePages } = usePages();

  const goPage = async () => {
    try {
      const newPage = await createPage(data);

      if (newPage && newPage.id) {
        console.log(newPage);
        console.log(`projects/${id}/pages/${newPage.id}`);
        navigate(`pages/${newPage.id}`);
      }
    } catch (error) {
      console.log(error);
    }
    return;
  };

  const deletePage = (id: any) => {
    try {
      deletePages(id);
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
        {pages.map((page: any, index: number) => {
          return (
            <div className="flex justify-between items-center" key={index}>
              <p>{page.title}</p>
              <button onClick={() => deletePage(page.id)}>X</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllPages;
