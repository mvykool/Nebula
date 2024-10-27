import { strings } from "../constants/strings";
import { useProject } from "../hooks/useProject";
import { useParams } from "react-router";

const PublishProject = () => {
  const { projectId } = useParams();
  const { updateProject } = useProject();

  const publish = () => {
    const updatedData = { publish: true };
    console.log(updatedData); // Log the updated state
    updateProject(projectId, updatedData);
  };

  return (
    <button
      onClick={publish}
      type="button"
      className="px-2 py-1 rounded-md bg-primary"
    >
      {strings.sidebar.publish}
    </button>
  );
};

export default PublishProject;