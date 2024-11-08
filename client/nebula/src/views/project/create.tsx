import { useState, ChangeEvent, FormEvent } from "react";
import { useProject } from "../../hooks/useProject";
import { useNavigate } from "react-router";

const CreateProject = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [input, setInput] = useState({
    name: "",
    cover: "",
  });

  const { createProject } = useProject();
  const navigate = useNavigate();

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:3000/upload/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = "http://localhost:3000" + data.url;

          setInput((prev) => ({ ...prev, cover: imageUrl }));
          setPreviewUrl(imageUrl);
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (input.name !== "") {
      try {
        await createProject(input);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    alert("please provide a valid input");
  };

  const handleInput = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //temporal goback btn
  const goBack = () => {
    navigate("/");
  };

  return (
    <>
      {/*main section*/}
      <div className="relative w-5/6 mx-auto mt-10">
        <button
          onClick={goBack}
          type="button"
          className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 px-3 py-1 rounded-md gap-1"
        >
          <i className="bx bx-left-arrow-alt text-xl"></i>
          back
        </button>

        <div className=" flex flex-col border border-hover rounded-md pb-20 w-4/6 mx-auto">
          <div className="w-full relative flex flex-col gap-6">
            {previewUrl && (
              <img
                crossOrigin="anonymous"
                src={previewUrl}
                alt="profile-picture"
                className="mx-auto relative h-[30vh] object-cover w-full boder boder-white outline outline-2 outline-offset-2"
              />
            )}

            <label
              className={`${previewUrl ? "mt-2" : "mt-20"} mx-auto bg-primary p-2 text-black dark:text-white font-semibold tracking-wide rounded-md text-sm cursor-pointer`}
              htmlFor="file-upload"
            >
              Add a project image
            </label>

            <input
              type="file"
              id="file-upload"
              name="cover"
              accept="image/*"
              onChange={handleImage}
            />
          </div>

          <div className="w-6/12 p-4 mt-10 flex flex-col items-center mx-auto">
            <h3 className="my-3 font-extrabold text-lg text-black dark:text-white">
              Create your project
            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col text-black dark:text-white "
            >
              <label className="font-semibold">Name</label>
              <input
                id="name"
                type="text"
                onChange={handleInput}
                name="name"
                className="w-full mb-5 mt-1 rounded-md py-1 px-2 text-black"
              />
              <button
                type="submit"
                className="mt-8 px-2 py-1 rounded-md bg-secondary"
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
