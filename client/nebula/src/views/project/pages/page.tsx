/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePages } from "../../../hooks/usePage";

const Page = () => {
  const { projectId, pageId } = useParams();
  const { fetchPage, updatePages, fetchMyPages } = usePages();
  const [data, setData] = useState({
    title: "",
    content: "",
  });

  const editor = useCreateBlockNote();

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      if (!projectId) {
        console.error("Project ID is undefined");
        return;
      }

      try {
        const result: any = await fetchPage(pageId);
        setData(result);
        console.log("updated page:", result[0]);

        // Parse the description
        let descriptionContent = [];
        try {
          const parsedContent = JSON.parse(result.content || "[]");
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
            content: result.title,
          },
          ...descriptionContent,
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [projectId, pageId, fetchPage, editor]);

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

  const saveData = useCallback(async (): Promise<void> => {
    if (!projectId || !pageId) {
      console.error("Project ID or Page ID is undefined");
      return;
    }

    const blocks = editor.document;
    const contentEditor = blocks.map(extractContentFromBlock);

    // Extract title from the first block if it's a heading
    const title =
      blocks[0].type === "heading"
        ? blocks[0].content.map((c: any) => c.text).join("")
        : data.title;

    // Convert content to the expected format
    const content = JSON.stringify(
      contentEditor.slice(1).map((block) => [block]),
    );

    try {
      // Only send the fields that the backend expects
      const updatePayload = {
        title,
        content,
        // parentId: data.parentId // Include this if you need to update the parent
      };

      const updatedData = await updatePages(Number(pageId), updatePayload);
      setData(updatedData);
      await fetchMyPages(Number(projectId));
      console.log("Data saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }, [editor, projectId, pageId, data.title, updatePages, fetchMyPages]);

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
    <div className="w-full md:w-9/12 px-0 md:px-7  mx-auto pt-20">
      <BlockNoteView editor={editor} data-theming-css-variables-demo />
    </div>
  );
};

export default Page;
