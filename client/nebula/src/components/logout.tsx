import React from "react";
import { useNavigate } from "react-router";

interface LogOutProps {
  auth: {
    logOut: () => void;
  };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Logout = ({ auth, setIsOpen }: LogOutProps) => {
  const navigate = useNavigate();

  //handle profile
  const handleProfile = () => {
    navigate("/profile");
  };

  //handle function
  const handleLogOut = () => {
    auth.logOut();
    setIsOpen(false);
  };

  const handleStarred = () => {
    navigate("/starred");
    setIsOpen(false);
  };

  const handleProjects = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleExplore = () => {
    navigate("/explore");
    setIsOpen(false);
  };

  return (
    <div className="border-b z-40 bg-bgLight dark:bg-bgDark border-r border-l boder-gray-700 dark:border-gray-500 absolute w-48 md:w-full right-0 flex flex-col gap-3 rounded-b-md">
      <button
        className="flex items-center pl-5 py-3 gap-3 hover:bg-primary hover:bg-opacity-20 hover:dark:bg-black rounded-b-md"
        onClick={handleProfile}
      >
        <i className="bx bx-user-circle text-lg"></i>
        Profile
      </button>
      <button
        className="flex items-center pl-5 py-3 gap-3 hover:bg-primary hover:bg-opacity-20 hover:dark:bg-black rounded-b-md"
        onClick={handleProjects}
      >
        <i className="bx bx-book text-lg"></i>
        My projects
      </button>
      <button
        className="flex items-center pl-5 py-3 gap-3 hover:bg-primary hover:bg-opacity-20 hover:dark:bg-black rounded-b-md"
        onClick={handleExplore}
      >
        <i className="bx bx-planet text-lg"></i>
        Explore
      </button>

      <button
        className="flex items-center pl-5 py-3 gap-3 hover:bg-primary hover:bg-opacity-20 hover:dark:bg-black rounded-b-md"
        onClick={handleStarred}
      >
        <i className="bx bx-star text-lg"></i>
        Starred projects
      </button>
      <button
        className="flex items-center pl-5 py-3 gap-3 hover:bg-primary hover:bg-opacity-20 hover:dark:bg-black rounded-b-md"
        onClick={handleLogOut}
      >
        <i className="bx bx-log-out text-red-400"></i>
        Logout
      </button>
    </div>
  );
};

export default Logout;
