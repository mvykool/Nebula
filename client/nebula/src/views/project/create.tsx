import { useState, FormEvent } from "react";
import { useProject } from "../../hooks/useProject";
import { useNavigate } from "react-router";
import UploadImage from "../../components/uploadImage";

interface ProjectInput {
  name: string;
  cover?: string;
  description?: string;
  publish?: boolean;
}

const CreateProject = () => {
  const [input, setInput] = useState<ProjectInput>({
    name: "",
    cover: "",
    description: "",
    publish: false,
  });

  const { createProject } = useProject();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (input.name.trim() !== "") {
      try {
        await createProject(input);
        navigate("/");
      } catch (error) {
        console.error("Error creating project:", error);
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
      <div className="relative w-full md:w-5/6 mx-auto mt-10">
        <button
          onClick={goBack}
          type="button"
          className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 px-3 py-1 ml-5 md:ml-0 rounded-md gap-1"
        >
          <i className="bx bx-left-arrow-alt text-xl"></i>
          back
        </button>
        <div className="flex flex-col border border-hover rounded-md pb-20 w-11/12 md:w-4/6 mt-10 md:mt-0 mx-auto">
          <UploadImage setInput={setInput} />
          <div className="w-9/12 md:w-6/12 p-4 mt-10 flex flex-col items-center mx-auto">
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
