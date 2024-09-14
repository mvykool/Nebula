import { useAuth } from "../hooks/authProvider";

const Sidebar = () => {
  const { user, defaultPfp } = useAuth();

  return (
    <div className="border border-white left-0 top-0 sticky w-2/12 h-screen text-black dark:text-white bg-bgLight dark:bg-bgDark">
      {/*OWNER INFO*/}
      <div className="flex gap-3 mt-5 items-end p-8">
        <img
          src={user?.picture || defaultPfp}
          className="h-14 w-14 rounded-md"
          alt="user-picture"
        />
        <p className="font-semibold text-xl">{user?.username}</p>
      </div>

      {/*PROJECT SECTIONS*/}
      <div className="p-8 ">
        <span className="font-bold">Pages:</span>

        <div className="w-full h-96"></div>

        {/*IMPORTANT BUTTONS*/}
        <div className="gap-4 items-start flex flex-col">
          <button type="button" className="px-2 py-1 rounded-md bg-primary">
            Delete Project
          </button>
          <button type="button" className="px-2 py-1 rounded-md bg-invalid">
            Save Project
          </button>
          <button type="button" className="px-2 py-1 rounded-md bg-primary">
            Publish Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
