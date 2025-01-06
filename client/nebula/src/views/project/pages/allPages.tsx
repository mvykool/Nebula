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
    title: "undefined",
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

  const deletePage = async (id: any) => {
    try {
      await deletePages(id);
      console.log("page deleted");
      fetchMyPages();
    } catch (error) {
      console.log(error);
    }
  };

  const goPage = (id: number) => {
    navigate(`pages/${id}`);
  };

  const project = () => {
    navigate(`/projects/${id}`);
  };

  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex justify-between my-5">
          {" "}
          <button onClick={project}>{name}</button>{" "}
          <button onClick={addPage} type="button">
            {strings.sidebar.addPage}
          </button>
        </div>
        {Array.isArray(myPages) && myPages.length > 0 ? (
          myPages.map((page) => (
            <div className="flex justify-between items-center" key={page.id}>
              <p onClick={() => goPage(page.id)}>{page.title}</p>
              <button onClick={() => deletePage(page.id)}>X</button>
            </div>
          ))
        ) : (
          <p> </p>
        )}
      </div>
    </div>
  );
};

export default AllPages;
