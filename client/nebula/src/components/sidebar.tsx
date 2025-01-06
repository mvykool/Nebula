import { useAuth } from "../hooks/authProvider";
import { useParams } from "react-router";
import { useProject } from "../hooks/useProject";
import { useNavigate } from "react-router";
import { strings } from "../constants/strings";
import AllPages from "../views/project/pages/allPages";
import PublishProject from "./publishProject";
import { useEffect, useState } from "react";

interface Iprops {
  id: string | undefined;
}

const Sidebar = ({ id }: Iprops) => {
  const [projectName, setProjectName] = useState<string | undefined>("");
  const { user, defaultPfp } = useAuth();

  //context for project
  const { deleteProject, fetchProject } = useProject();
  const { projectId } = useParams();

  const navigate = useNavigate();

  const handleDelete = (): void => {
    deleteProject(projectId);
    navigate("/");
  };

  const goBack = (): void => {
    navigate("/");
  };

  useEffect(() => {
    const project = async () => {
      const projectData = await fetchProject(id);
      setProjectName(projectData?.name);
    };

    project();
  }, [id]);

  console.log(projectName);

  return (
    <div className="border border-white left-0 top-0 sticky w-2/12 h-screen text-black dark:text-white bg-bgLight dark:bg-bgDark">
      {/*OWNER INFO*/}
      <button
        onClick={goBack}
        type="button"
        className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 ml-8 mt-3 px-3 py-1 rounded-md gap-1"
      >
        <i className="bx bx-left-arrow-alt text-xl"></i>
        {strings.backButton}
      </button>
      <div className="flex gap-3 mt-2 items-end p-8">
        <img
          src={user?.picture || defaultPfp}
          className="h-14 w-14 rounded-md"
          alt="user-picture"
        />
        <p className="font-semibold text-xl">{user?.username}</p>
      </div>

      {/*PROJECT SECTIONS*/}
      <div className="p-8 ">
        <div className="w-full h-96">
          {" "}
          <AllPages id={id} name={projectName} />
        </div>

        {/*IMPORTANT BUTTONS*/}
        <div className="gap-4 items-start flex flex-col">
          <button
            onClick={handleDelete}
            type="button"
            className="px-2 py-1 rounded-md bg-primary"
          >
            {strings.sidebar.delete}
          </button>
          <PublishProject />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
