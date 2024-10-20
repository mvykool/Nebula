/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useState, useEffect } from "react";

interface Iprops {
  pages: any;
  id: string | undefined;
}

const AllPages = ({ pages, id }: Iprops) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "undefined",
    content: "",
    project: id,
  });
  const { createPage } = usePages();

  const goPage = async () => {
    try {
      await createPage(data);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  useEffect(() => {
    console.log(
      pages.map((page: any) => {
        return page.title;
      }),
    );
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <p>pages</p>{" "}
        <button onClick={goPage} type="button">
          add page
        </button>
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
