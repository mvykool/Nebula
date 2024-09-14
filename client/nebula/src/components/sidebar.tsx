import { useAuth } from "../hooks/authProvider";

const Sidebar = () => {
  const { user, defaultPfp } = useAuth();

  return (
    <div className="border border-white left-0 top-0 w-2/12 h-screen text-black dark:text-white">
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
      <div className="p-8 mt-5">
        <span className="font-bold">Pages:</span>
      </div>
    </div>
  );
};

export default Sidebar;
