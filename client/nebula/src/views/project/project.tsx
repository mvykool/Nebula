/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../../components/sidebar";
import { Outlet, useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { useEffect, useState, useCallback } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { usePages } from "../../hooks/usePage";

const Project = () => {
  const { projectId } = useParams();
  const { fetchProject, updateProject } = useProject();
  const { myPages } = usePages();
  const [data, setData] = useState({
    name: "",
    cover: "",
    description: "",
    pages: [""],
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

        // Parse the description
        let descriptionContent = [];
        try {
          const parsedContent = JSON.parse(result.description || "[]");
          descriptionContent = parsedContent
            .flat()
            .map((item: { content: any; type: string; props: any }) => ({
              type: item.type,
              props: item.props,
              content: item.content,
            }));
          console.log(descriptionContent);
        } catch (error) {
          console.error("Error parsing description:", error);
        }

        // Update editor content
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
    return {
      type: block.type,
      props: block.props,
      content: block.content,
      children: block.children
        ? block.children.map(extractContentFromBlock)
        : [],
    };
  };

  const saveData = useCallback(async () => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }
    const blocks = editor.document;
    const content = blocks.map(extractContentFromBlock);

    // Extract name from the first block if it's a heading
    const name =
      blocks[0].type === "heading"
        ? blocks[0].content.map((c: any) => c.text).join("")
        : data.name;

    // Convert content to the expected format
    const description = JSON.stringify(
      content.slice(1).map((block) => [block]),
    );

    const pages = myPages;

    try {
      const updatedData = await updateProject(projectId, {
        ...data,
        name,
        description,
        pages,
      });
      setData(updatedData);
      console.log("Data saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }, [editor, projectId, data, updateProject]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
      <Sidebar id={projectId} />
      {window.location.pathname == `/projects/${projectId}` ? (
        <div className="w-full bg-bgLight dark:bg-bgDark">
          <div className="w-full h-16 p-5 flex justify-start items-center">
            <p className="font-bold">{data?.name}</p>
          </div>

          {data?.cover && (
            <img
              src={data?.cover}
              alt="cover-image"
              className="w-full object-cover h-[28vh]"
            />
          )}

          <div className="w-5/6 my-10 mx-auto">
            <BlockNoteView editor={editor} data-theming-css-variables-demo />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Project;
