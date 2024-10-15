import { useAuth } from "../hooks/authProvider";
import { useProject } from "../hooks/useProject";
import { useNavigate } from "react-router";
import { strings } from "../constants/strings";

const Sidebar = () => {
  const { user, defaultPfp } = useAuth();

  //context for project
  const { deleteProject } = useProject();

  const navigate = useNavigate();

  const handleDelete = () => {
    deleteProject();
  };

  const goBack = () => {
    navigate("/");
  };
  return (
    <div className="border border-white left-0 top-0 sticky w-2/12 h-screen text-black dark:text-white bg-bgLight dark:bg-bgDark">
      {/*OWNER INFO*/}
      <button
        onClick={goBack}
        type="button"
        className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 ml-8 mt-3 px-3 py-1 rounded-md gap-1"
      >
        <i className="bx bx-left-arrow-alt text-xl"></i>
        back
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
        <span className="font-bold">{strings.sidebar.pages}</span>

        <div className="w-full h-96"></div>

        {/*IMPORTANT BUTTONS*/}
        <div className="gap-4 items-start flex flex-col">
          <button
            onClick={handleDelete}
            type="button"
            className="px-2 py-1 rounded-md bg-primary"
          >
            {strings.sidebar.delete}
          </button>
          <button type="button" className="px-2 py-1 rounded-md bg-primary">
            {strings.sidebar.publish}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
