import { useState, useRef, MouseEvent as ReactMouseEvent, useEffect } from "react";
import { useAuth } from "../hooks/authProvider"

const UserAndLogOut = () => {

  //set the button for username 
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  //set authProvider
  const auth = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    // add event listener
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen]);

  const toggleUsername = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen(prevState => !prevState);
  }

  return (
    <div ref={ref} className="relative">
      <div
        className="flex cursor-pointer items-center gap-3 hover:bg-gray-800 pr-14 rounded-md"
        onClick={toggleUsername}
      >
        <img
          src="https://avatars.githubusercontent.com/u/87054757?v=4"
          className="h-10 w-10 rounded-md"
          alt="user-picture"
        />
        <p className="font-semibold">username</p>
      </div>

      {isOpen && (
        <div className="border boder-white absolute w-full rounded-b-md py-5">
          <button
            className="flex items-center gap-2 ml-3"
            onClick={() => auth.logOut()}
          >
            Logout
            <i className='bx bx-exit'></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserAndLogOut
