import { useNavigate } from "react-router";

const CreateButton = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/project/creation");
  };

  return (
    <button
      onClick={handleCreate}
      className="my-5 px-5 py-2 rounded-md bg-secondary cursor-pointer hover:bg-highlight font-semibold tracking-wide text-black transition-all"
    >
      Create new project
    </button>
  );
};

export default CreateButton;
