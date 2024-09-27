import Sidebar from "../../components/sidebar";
import { useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
  });

  return (
    <div className="w-full flex text-black dark:text-white">
      {/*SIDE BAR*/}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="w-full bg-bgLight dark:bg-bgDark">
        <img
          src={data?.cover}
          alt="cover-image"
          className="w-full object-cover h-[25vh]"
        />

        <div className="w-5/6 mx-auto">
          {/*TITLE*/}
          <h3 className="text-5xl py-24 px-5">{data?.name}</h3>

          {/*CONTENT*/}
          <p className="p-5">{data?.description}</p>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Project;
