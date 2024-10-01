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
        const descriptionContent = JSON.parse(result.description || "[]");
        editor.replaceBlocks(editor.document, [
          {
            id: "header",
            type: "heading",
            content: result.name,
          },
          ...descriptionContent,
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [projectId, fetchProject, editor]);

  const extractContentFromBlock = (block: any): any => {
    if (Array.isArray(block?.content)) {
      return block.content.map((b: any) => ({
        type: b.type,
        content: b.text,
        children: extractContentFromBlock(b.children),
      }));
    } else if (block?.content) {
      return {
        type: block.type,
        content: block.content.text,
        children: extractContentFromBlock(block.children),
      };
    }
    return [];
  };

  const saveData = useCallback(async () => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }
    const blocks = editor.topLevelBlocks;
    const content = blocks.map(extractContentFromBlock);
    try {
      const updatedData = await updateProject(projectId, {
        ...data,
        name: content[0]?.content || "",
        description: JSON.stringify(content.slice(1)),
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
