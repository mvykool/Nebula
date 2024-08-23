import { useState } from "react";
import { useAuth } from "../hooks/authProvider"

const UserAndLogOut = () => {

  //set the button for username 
  const [username, setUsername] = useState(false)

  //set authProvider
  const auth = useAuth();
  return (
    <div className="relative">
      <div
        className="flex cursor-pointer items-center gap-3 hover:bg-gray-800 pr-14 rounded-md"
        onClick={() => setUsername(!username)}
      >
        <img
          src="https://avatars.githubusercontent.com/u/87054757?v=4"
          className="h-10 w-10 rounded-md"
          alt="user-picture"
        />
        <p className="font-semibold">username</p>
      </div>

      {username
        ? <div className="border boder-white absolute w-full rounded-b-md py-5">
          <button
            className="flex items-center gap-2 ml-3"
            onClick={() => auth.logOut()}
          >
            Logout
            <i className='bx bx-exit'></i>
          </button>
        </div>
        : null
      }
    </div>
  )
}

export default UserAndLogOut
