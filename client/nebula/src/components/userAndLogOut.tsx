import { useState, useRef, MouseEvent as ReactMouseEvent, useEffect } from "react";
import { useAuth } from "../hooks/authProvider"
import Logout from "./logout";
import Username from "./username";

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
        className={`flex cursor-pointer items-center gap-3 hover:bg-gray-200 pr-12 rounded-md ${isOpen ? 'bg-gray-200' : 'bg-opacity-0'}`}
        onClick={toggleUsername}
      >
        <Username />
      </div>

      {isOpen && (
        <Logout auth={auth} setIsOpen={setIsOpen} />
      )}
    </div>
  )
}

export default UserAndLogOut
