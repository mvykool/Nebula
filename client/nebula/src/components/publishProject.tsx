import { strings } from "../constants/strings";
import { useProject } from "../hooks/useProject";
import { useParams } from "react-router";

const PublishProject = () => {
  const { projectId } = useParams();
  const { updateProject } = useProject();

  const publish = (): void => {
    const updatedData = { publish: true };
    console.log(updatedData);
    updateProject(projectId, updatedData);
  };

  return (
    <button
      onClick={publish}
      type="button"
      className="px-2 py-1 flex items-center gap-2 rounded-md bg-primary hover:bg-primary-dark"
    >
      <i className="bx bx-rocket"></i>
      {strings.sidebar.publish}
    </button>
  );
};

export default PublishProject;
