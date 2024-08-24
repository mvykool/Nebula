import React from 'react'

interface LogOutProps {
  auth: {
    logOut: () => void;
  };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Logout = ({ auth, setIsOpen }: LogOutProps) => {

  //handle function
  const handleLogOut = () => {
    auth.logOut();
    setIsOpen(false)
  }

  return (
    <div className="border boder-white absolute w-full rounded-b-md py-5">
      <button
        className="flex items-center gap-2 ml-5"
        onClick={handleLogOut}
      >
        Logout
        <i className='bx bx-exit text-red-400'></i>
      </button>
    </div>
  )
}

export default Logout
