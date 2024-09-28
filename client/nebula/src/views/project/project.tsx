/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../../components/sidebar";
import { useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { useEffect, useState, useCallback } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

const Project = () => {
  const { projectId } = useParams();
  const { fetchProject, updateProject } = useProject();
  const [data, setData] = useState({
    name: "",
    cover: "",
    description: "",
  });

  const editor = useCreateBlockNote();

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.error("Project ID is undefined");
        return;
      }
      try {
        const result = await fetchProject(projectId);
        setData(result);
        console.log(result);

        // Update editor content
        editor.replaceBlocks(editor.document, [
          {
            id: "header",
            type: "heading",
            content: result.name,
          },
          {
            id: "description",
            type: "paragraph",
            content: result.description,
          },
        ]);

        console.log(editor.getBlock("description"));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [projectId, fetchProject, editor]);

  const extractTextFromBlock = (block: any) => {
    if (Array.isArray(block?.content)) {
      // If it's an array, map and join the content
      return block.content.map((b: any) => b.text || "").join("");
    } else if (block?.content?.text) {
      // If it's an object with a `text` property, just return it
      return block.content.text;
    }
    return "";
  };

  const saveData = useCallback(async () => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }

    // Get the header and description blocks
    const headerBlock = editor.getBlock("header");
    const descriptionBlock = editor.getBlock("description");

    // Extract text using helper function
    const name = extractTextFromBlock(headerBlock);
    const description = extractTextFromBlock(descriptionBlock);

    try {
      const updatedData = await updateProject(projectId, {
        ...data,
        name,
        description,
      });
      setData(updatedData);
      console.log("Data saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }, [editor, projectId, data, updateProject]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveData();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveData]);

  return (
    <div className="w-full flex text-black dark:text-white">
      <Sidebar />
      <div className="w-full bg-bgLight dark:bg-bgDark">
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
