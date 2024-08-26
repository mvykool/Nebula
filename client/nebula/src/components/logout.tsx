import React from 'react'
import { useNavigate } from 'react-router';

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
    navigate("/profile")
  }

  //handle function
  const handleLogOut = () => {
    auth.logOut();
    setIsOpen(false)
  }

  return (
    <div className="border boder-white absolute w-full flex flex-col gap-3 rounded-b-md py-5">
      <button
        className="flex items-center ml-5 gap-3"
        onClick={handleProfile}
      >
        <i className='bx bx-user-circle'></i>
        Profile
      </button>
      <button
        className="flex items-center ml-5 gap-3"
        onClick={handleLogOut}
      >
        <i className='bx bx-log-out text-red-400'></i>
        Logout
      </button>
    </div>
  )
}

export default Logout
