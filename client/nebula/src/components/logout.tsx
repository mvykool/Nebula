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

  return (
    <div className="border boder-white absolute w-full flex flex-col gap-3 rounded-b-md">
      <button
        className="flex items-center pl-5 py-3 gap-3 hover:bg-primary hover:bg-opacity-20 hover:dark:bg-black rounded-b-md"
        onClick={handleProfile}
      >
        <i className="bx bx-user-circle text-lg"></i>
        Profile
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
