import { useState } from "react";
import UserAndLogOut from "./userAndLogOut";
import { NavLink } from "react-router-dom";
import { strings } from "../constants/strings";

const Navbar = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(true);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(false);
    }
  };

  return (
    <div className="w-full h-16 flex justify-between items-center">
      {/*Logo*/}
      <div className="flex gap-2 w-[205px]">
        <i className="bx bxs-analyse text-xl text-primary"></i>
        <a href="/" className="font-bold text-black dark:text-white text-lg">
          Neb<span className="text-primary">u</span>la
        </a>
      </div>

      {/*Main button*/}
      <div className=" flex items-center gap-3">
        <NavLink
          to={"/"}
          className="aria-[current=page]:bg-primary-light px-2 text-black dark:text-white py-1 font-semibold tracking-wide rounded-md"
        >
          {strings.navbar.project}
        </NavLink>
        <NavLink
          to={"/explore"}
          className="aria-[current=page]:bg-primary-light px-2 text-black dark:text-white py-1 font-semibold tracking-wide rounded-md"
        >
          {strings.navbar.explore}
        </NavLink>
      </div>

      {/*user info and logout*/}
      <div className="flex items-center gap-3 w-[205px] text-black dark:text-white">
        <ul className="flex gap-3 mr-4">
          <li>
            <button
              type="button"
              className="rounded-full hover:bg-hover dark:hover:bg-opacity-30"
              onClick={toggleTheme}
            >
              {isDark ? (
                <i className="bx bx-moon text-xl h-8 flex justify-center items-center w-8 cursor-pointer"></i>
              ) : (
                <i className="bx bx-sun text-xl h-8 flex justify-center items-center w-8 cursor-pointer"></i>
              )}
            </button>
          </li>
          <li>
            <i className="bx bx-bell text-xl cursor-pointer rounded-full w-8 h-8 flex justify-center items-center hover:bg-hover dark:hover:bg-opacity-30"></i>
          </li>
        </ul>

        {/*image and name*/}
        <UserAndLogOut />
      </div>
    </div>
  );
};

export default Navbar;
