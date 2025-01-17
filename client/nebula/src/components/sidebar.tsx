import { useAuth } from "../hooks/authProvider";
import { useParams } from "react-router";
import { useProject } from "../hooks/useProject";
import { useNavigate } from "react-router";
import { strings } from "../constants/strings";
import AllPages from "../views/project/pages/allPages";
import PublishProject from "./publishProject";
import { usePages } from "../hooks/usePage";
import { useEffect, useState } from "react";

interface Iprops {
  id: string | undefined;
}

const Sidebar = ({ id }: Iprops) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const { user, defaultPfp } = useAuth();
  const { deleteAllPages } = usePages();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { myProjects, deleteProject } = useProject();

  // Find the current project in the myProjects array
  // Add useEffect to log when myProjects or id changes
  useEffect(() => {
    console.log("Sidebar: myProjects updated:", myProjects);
    console.log("Sidebar: current id:", id);
  }, [myProjects, id]);

  const currentProject = myProjects.find((project) => {
    console.log(
      "Comparing project.id:",
      project.id,
      "with id:",
      id,
      "type of project.id:",
      typeof project.id,
      "type of id:",
      typeof id,
    );
    return project.id === Number(id);
  });

  console.log("Sidebar: currentProject found:", currentProject);
  const projectName = currentProject?.name;
  console.log("Sidebar: projectName:", projectName);

  const handleDelete = (): void => {
    if (projectId) {
      deleteProject(Number(projectId));
      deleteAllPages();
      navigate("/");
    }
  };

  const hideSidebar = () => {
    setIsHidden((previous) => !previous);
  };

  return (
    <div className={`relative z-50 ${isHidden ? "w-2" : "w-[15vw]"}`}>
      <div
        className={`fixed left-0 top-0 h-screen transform transition-transform duration-200 ease-in-out
          ${isHidden ? "-translate-x-full" : "translate-x-0"}
          border border-gray-800 max-w-[15vw] text-black dark:text-white bg-bgLight dark:bg-bgDark`}
      >
        {/*OWNER INFO*/}
        <div className="flex items-center p-2">
          <div className="flex gap-2 w-[205px]">
            <i className="bx bxs-analyse text-xl text-primary"></i>
            <a
              href="/"
              className="font-bold tracking-wide text-black dark:text-white text-lg"
            >
              Neb<span className="text-primary">u</span>la
            </a>
          </div>
          <button onClick={hideSidebar}>
            <i className="bx bxs-chevrons-left px-2 text-2xl border border-gray-800 rounded-lg"></i>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2 p-4">
          <img
            src={user?.picture || defaultPfp}
            className="h-14 w-14 rounded-md"
            alt="user-picture"
          />
          <p className="font-semibold text-xl">{user?.username}</p>
        </div>
        {/*PROJECT SECTIONS*/}
        <div>
          <div className="gap-4 p-2 my-4 text-sm items-start flex flex-col">
            <button
              onClick={() => navigate("/")}
              type="button"
              className="px-2 flex gap-2 items-center py-1"
            >
              <i className="bx bx-home"></i>
              Home
            </button>
            <button
              onClick={handleDelete}
              type="button"
              className="px-2 flex gap-2 items-center py-1"
            >
              <i className="bx bx-trash"></i>
              {strings.sidebar.delete}
            </button>
            <PublishProject />
          </div>

          <div className="border border-gray-400 w-full"></div>
          <p className="px-4 pt-3 pb-5 text-gray-700 dark:text-gray-400">
            Workspace
          </p>
          <div className="w-full px-4 min-h-[50vh]">
            <AllPages projectId={id} name={projectName} />
          </div>
          {/*IMPORTANT BUTTONS*/}
        </div>
      </div>

      {/* Toggle button */}
      <button
        className={` top-0 p-5 transition-transform duration-300 ease-in-out`}
        onClick={hideSidebar}
      >
        <i
          className={`bx ${isHidden ? "bxs-chevrons-right" : "hidden"} px-2 text-2xl border border-gray-800 rounded-lg`}
        ></i>
      </button>
    </div>
  );
};

export default Sidebar;
