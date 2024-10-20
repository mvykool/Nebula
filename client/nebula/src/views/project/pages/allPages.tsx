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
  const { createPage } = usePages();

  const goPage = async () => {
    try {
      const newPage = await createPage(data);

      if (newPage && newPage.id) {
        console.log(newPage);
        console.log(`projects/${id}/pages/${newPage.id}`);
      }
    } catch (error) {
      console.log(error);
    }
    return;
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
            <div key={index}>
              <p>{page.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllPages;
