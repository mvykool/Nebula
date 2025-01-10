import { useState, ChangeEvent, FormEvent } from "react";
import { useProject } from "../../hooks/useProject";
import { useNavigate } from "react-router";
import Loading from "../../components/loading";

const CreateProject = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const [input, setInput] = useState({
    name: "",
    cover: "",
    description: "",
    pages: [],
    id: 1,
  });

  const { createProject } = useProject();
  const navigate = useNavigate();

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
          setInput((prev) => ({ ...prev, cover: imageUrl }));
          setPreviewUrl(imageUrl);
          setImageLoaded(false); // Reset image loaded state for new image
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

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false); // Only hide loading state when image is actually loaded
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (input.name !== "") {
      try {
        await createProject(input);
        navigate("/"); // Navigate after successful creation
      } catch (error) {
        console.log(error);
        alert("Failed to create project. Please try again.");
      }
      return;
    }
    alert("Please provide a project name");
  };

  const handleInput = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="relative w-5/6 mx-auto mt-10">
        <button
          onClick={goBack}
          type="button"
          className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 px-3 py-1 rounded-md gap-1"
        >
          <i className="bx bx-left-arrow-alt text-xl"></i>
          back
        </button>

        <div className="flex flex-col border border-hover rounded-md pb-20 w-4/6 mx-auto">
          <div className="w-full relative flex flex-col gap-6">
            <div className="relative">
              {isLoading && (
                <div className=" flex items-end justify-center pt-32">
                  <Loading />
                </div>
              )}

              {previewUrl && (
                <img
                  crossOrigin="anonymous"
                  src={previewUrl}
                  alt="project-cover"
                  className={`mx-auto relative h-full object-cover w-full border border-white outline outline-2 outline-offset-2 ${
                    !imageLoaded ? "hidden" : ""
                  }`}
                  onLoad={handleImageLoad}
                />
              )}
            </div>

            <label
              className={`${
                previewUrl ? "mt-2" : "mt-20"
              } mx-auto bg-primary p-2 text-black dark:text-white font-semibold tracking-wide rounded-md text-sm cursor-pointer hover:bg-primary/90`}
              htmlFor="file-upload"
            >
              {previewUrl ? "Change project image" : "Add a project image"}
            </label>

            <input
              type="file"
              id="file-upload"
              name="cover"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>

          <div className="w-6/12 p-4 mt-10 flex flex-col items-center mx-auto">
            <h3 className="my-3 font-extrabold text-lg text-black dark:text-white">
              Create your project
            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col text-black dark:text-white"
            >
              <label className="font-semibold">Name</label>
              <input
                id="name"
                type="text"
                onChange={handleInput}
                name="name"
                required
                className="w-full mb-5 mt-1 rounded-md py-1 px-2 text-black"
                placeholder="Enter project name"
              />
              <button
                type="submit"
                className="mt-8 px-2 text-black py-1 rounded-md bg-secondary hover:bg-secondary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!input.name.trim()}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
