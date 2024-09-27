import Sidebar from "../../components/sidebar";
import { useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

const Project = () => {
  const { projectId } = useParams();
  const { fetchProject } = useProject();
  const [data, setData] = useState({
    name: "",
    cover: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchProject(projectId);
        setData(result);
        console.log(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [projectId, fetchProject]);

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: `${data?.name}`,
      },
      {
        type: "paragraph",
        content: "",
      },
    ],
  });

  return (
    <div className="w-full flex text-black dark:text-white">
      {/*SIDE BAR*/}
      <Sidebar desc={data?.description} />

      {/* MAIN CONTENT */}
      <div className="w-full bg-bgLight dark:bg-bgDark">
        {/* TOP BAR */}
        <div className="w-full h-16 p-5 flex justify-start items-center">
          <p className="font-bold">{data?.name}</p>
        </div>

        <img
          src={data?.cover}
          alt="cover-image"
          className="w-full object-cover h-[28vh]"
        />

        <div className="w-5/6 my-10 mx-auto">
          <BlockNoteView editor={editor} data-theming-css-variables-demo />
        </div>
      </div>
    </div>
  );
};

export default Project;
