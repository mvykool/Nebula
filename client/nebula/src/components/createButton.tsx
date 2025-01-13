import { useNavigate } from "react-router";
import { strings } from "../constants/strings";

const CreateButton = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/project/creation");
  };

  return (
    <button
      onClick={handleCreate}
      className="my-5 px-5 py-2 rounded-md bg-secondary cursor-pointer hover:bg-secondary-light font-semibold tracking-wide text-black transition-all"
    >
      {strings.project.createNew}
    </button>
  );
};

export default CreateButton;
