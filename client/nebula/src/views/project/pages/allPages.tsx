/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router";
import { usePages } from "../../../hooks/usePage";
import { useState } from "react";

interface Iprops {
  pages: string[];
  id: string | undefined;
}

const AllPages = ({ pages, id }: Iprops) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "",
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

  return (
    <div>
      <div className="flex justify-between">
        <p>pages</p>{" "}
        <button onClick={goPage} type="button">
          add page
        </button>
      </div>
    </div>
  );
};

export default AllPages;
