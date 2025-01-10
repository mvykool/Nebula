/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../../components/sidebar";
import { Outlet, useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { useEffect, useState, useCallback, ChangeEvent } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { usePages } from "../../hooks/usePage";
import { Page } from "../../types/page.type";
import { useNavigate } from "react-router";
import { strings } from "../../constants/strings";
import Loading from "../../components/loading";

interface ProjectData {
  name: string;
  cover: string;
  description: string;
  pages: Page[];
}

const Project = () => {
  const [coverChanged, setCoverChanged] = useState<boolean>(false);
  const [initialCover, setInitialCover] = useState<string>("");
  const { projectId } = useParams<{ projectId: string | undefined }>();
  const { fetchProject, updateProject } = useProject();
  const { myPages, fetchMyPages } = usePages();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [data, setData] = useState<ProjectData>({
    name: "",
    cover: "",
    description: "",
    pages: [],
  });
  const editor = useCreateBlockNote();

  const navigate = useNavigate();

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false); // Only hide loading state when image is actually loaded
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsLoading(true); // Set loading state before starting upload

      const formData = new FormData();
      formData.append("file", file);

      const urlBase = import.meta.env.VITE_URL;

      try {
        const response = await fetch(`${urlBase}/upload/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.url;
          setData((prev) => ({ ...prev, cover: imageUrl }));
          setImageLoaded(false); // Reset image loaded state for new image
          setCoverChanged(true);
          setImageLoaded(false);
        } else {
          console.error("Image upload failed");
          alert("Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      } finally {
        // Don't set isLoading to false here - we'll do that when the image actually loads
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.error("Project ID is undefined");
        return;
      }

      fetchMyPages();
      try {
        const result = await fetchProject(projectId);
        if (result) {
          // Ensure result is not undefined before updating state
          setData(result);
          setInitialCover(result.cover);
          console.log(result);

          // Parse and update the description content
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
              content: result?.name,
            },
            ...descriptionContent,
          ]);
        } else {
          console.error("Project not found or invalid response.");
        }
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
      setCoverChanged(false); // Reset the change tracking after successful save
      setInitialCover(updatedData.cover);
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

  const goBack = (): void => {
    navigate("/");
  };

  return (
    <div className="w-full flex text-black dark:text-white">
      <Sidebar id={projectId} />
      {window.location.pathname == `/projects/${projectId}` ? (
        <div className="w-full bg-bgLight dark:bg-bgDark">
          <div className="w-full h-20 p-5 flex gap-3 items-center py-1 pl-20">
            <button
              onClick={goBack}
              type="button"
              className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20  px-3 py-1 rounded-md"
            >
              <i className="bx bx-left-arrow-alt text-xl"></i>
              {strings.backButton}
            </button>
          </div>

          {isLoading && (
            <div className=" flex items-end justify-center pt-32">
              <Loading />
            </div>
          )}

          {data?.cover && (
            <div>
              <img
                src={data?.cover}
                alt="cover-image"
                className={`mx-auto relative w-11/12 object-cover h-[30vh] object-center rounded-lg ${
                  !imageLoaded ? "hidden" : ""
                }
                ${isLoading ? "hidden" : "flex"}`}
                onLoad={handleImageLoad}
              />
              <label
                className={`${
                  data.cover ? "mt-2" : "mt-20"
                } mx-auto bg-primary ml-20 p-2 text-black dark:text-white font-semibold tracking-wide rounded-md text-sm cursor-pointer hover:bg-primary/90`}
                htmlFor="file-upload"
              >
                {data.cover ? "Change project image" : "Add a project image"}
              </label>

              <input
                type="file"
                id="file-upload"
                name="cover"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
              <button
                onClick={saveData}
                disabled={!coverChanged}
                className={`px-3 py-2 rounded-md ${
                  !coverChanged
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-secondary hover:bg-secondary/90"
                }`}
              >
                Save
              </button>
            </div>
          )}

          <div className="w-full px-4 my-10 mx-auto">
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
