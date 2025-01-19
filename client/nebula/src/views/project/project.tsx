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
import Loading from "../../components/loading";
import { User } from "../../types/user.type";
import { useGenerateGradient } from "../../hooks/useGenerateColor";

interface ProjectData {
  name: string;
  cover: string;
  description: string;
  pages: Page[];
  id: number;
  owner?: User;
  publish?: boolean;
  publishedSlug?: string;
  starCount?: number;
}

const Project = () => {
  const gradient = useGenerateGradient();

  const [coverChanged, setCoverChanged] = useState<boolean>(false);
  const { projectId } = useParams<{ projectId: string | undefined }>();
  const { fetchProject, updateProject, setMyProjects } = useProject();
  const { fetchMyPages } = usePages();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [data, setData] = useState<ProjectData>({
    name: "",
    cover: "",
    description: "",
    pages: [],
    id: 1,
    owner: {
      email: "guest@guest.com",
      name: "guest",
      picture: "https://i.imgur.com/yyZrnuQ.jpeg",
      sub: "3",
      username: "guest",
      isDemo: true,
      isGoogleUser: false,
    },
  });
  const editor = useCreateBlockNote();

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false); // Only hide loading state when image is actually loaded
  };

  const removeCover = () => {
    setData((prev) => ({ ...prev, cover: "" }));
    setCoverChanged(true); // Indicate that the cover has been changed
    setImageLoaded(false); // Reset the image loaded state
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsLoading(true); // Set loading state before starting upload
      setImageLoaded(false); // Reset image loaded state for new image

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
          setCoverChanged(true);
          // Remove the setImageLoaded(false) here - let the onLoad handler handle it
        } else {
          console.error("Image upload failed");
          alert("Failed to upload image. Please try again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
        setCoverChanged(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.error("Project ID is undefined");
        return;
      }

      fetchMyPages(projectId);
      try {
        const result = await fetchProject(projectId);
        if (result) {
          // Ensure result is not undefined before updating state
          setData(result);
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

  // In your Project component, modify the saveData function:

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

    try {
      // Only send the allowed properties
      const updatePayload = {
        name,
        description,
        cover: data.cover,
        publish: data.publish, // Include this if you need to update publish status
      };

      console.log("Saving project with data:", updatePayload);
      const updatedData = await updateProject(projectId, updatePayload);
      console.log("Project updated response:", updatedData);

      setData(updatedData);
      setCoverChanged(false);

      const refreshedProject = await fetchProject(projectId);
      if (refreshedProject) {
        setMyProjects((prev: any) => {
          const updated = prev.map((project: any) =>
            project.id === projectId
              ? { ...project, ...refreshedProject }
              : project,
          );
          return updated;
        });
      }
      console.log("Data saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
    }
  }, [editor, projectId, data, updateProject, fetchProject]);

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
        <div className="w-full overflow-x-hidden bg-bgLight dark:bg-bgDark">
          {isLoading && (
            <div className=" flex items-end justify-center pt-32">
              <Loading />
            </div>
          )}

          {data?.cover ? (
            <div className="relative group w-full mx-0 md:w-11/12 md:mx-auto">
              <img
                src={data?.cover}
                alt="cover-image"
                className={` mt-10 relative w-full object-cover h-[15vh] md:h-[35vh] object-center rounded-lg
                ${!imageLoaded ? "hidden" : ""}
                ${isLoading ? "hidden" : "flex"}
                `}
                onLoad={handleImageLoad}
              />
              <div className="absolute inset-0 items-end justify-end hidden  bg-black bg-opacity-55 w-full rounded-lg group-hover:flex">
                <div className="flex p-3 gap-2">
                  <button
                    className={`${data.cover ? "block bg-red-500 py-2 font-semibold tracking-wide cursor-pointer rounded-md text-sm px-3" : "hidden"}`}
                    onClick={removeCover}
                  >
                    remove cover
                  </button>
                  <label
                    className={`
                    bg-primary 
                    px-3
                    py-2 
                    text-black 
                    dark:text-white 
                    font-semibold 
                    tracking-wide 
                    rounded-md 
                    text-sm 
                    cursor-pointer 
                    hover:bg-primary/90`}
                    htmlFor="file-upload"
                  >
                    {data.cover
                      ? "Change project image"
                      : "Add a project image"}
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
                    className={`px-3 text-sm rounded-md  
                  ${!coverChanged ? "bg-gray-400 cursor-not-allowed" : "bg-secondary hover:bg-secondary/90"}
                  `}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group w-11/12 mx-auto">
              <div
                style={{ background: gradient }}
                className=" mt-10 relative w-full object-cover h-[15vh] md:h-[35vh] object-center rounded-lg"
              ></div>

              <div className="absolute inset-0 items-end justify-end hidden  bg-black bg-opacity-55 w-full rounded-lg group-hover:flex">
                <div className="flex p-3 gap-2">
                  <label
                    className={`
                    bg-primary 
                    px-3
                    py-2 
                    text-black 
                    dark:text-white 
                    font-semibold 
                    tracking-wide 
                    rounded-md 
                    text-sm 
                    cursor-pointer 
                    hover:bg-primary/90`}
                    htmlFor="file-upload"
                  >
                    {data.cover
                      ? "Change project image"
                      : "Add a project image"}
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
                    className={`px-3 text-sm rounded-md ${data.cover ? "block" : "hidden"}  
                  ${!coverChanged ? "bg-gray-400 cursor-not-allowed" : "bg-secondary hover:bg-secondary/90"}
                  `}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full md:w-10/12 px-0 md:px-7 my-10 mx-auto">
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
