import UserAndLogOut from "./userAndLogOut";
import { NavLink } from "react-router-dom";
import { strings } from "../constants/strings";
import { ThemeSwitcher } from "./ThemeSwitcher";
import NotificationBell from "./notificationBell";
import { useAuth } from "../hooks/authProvider";

const Navbar = () => {
  const { fetchWithToken } = useAuth();
  const urlBase = import.meta.env.VITE_URL;

  return (
    <div className="w-full h-16 flex justify-between items-center">
      {/*Logo*/}
      <div className="flex gap-2 flex-0 md:flex-1 items-center ml-5 md:ml-0">
        <i className="bx bxs-analyse text-lg md:text-xl text-primary"></i>
        <a
          href="/"
          className="font-bold tracking-wide text-black dark:text-white text-sm md:text-lg"
        >
          Neb<span className="text-primary">u</span>la
        </a>
      </div>

      {/*Main button*/}
      <div className="hidden md:flex items-center gap-3 flex-0 md:flex-1">
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
      <div className="flex items-center gap-3 text-black dark:text-white">
        <div className=" items-center gap-3 mr-4 flex">
          <ThemeSwitcher />
          <NotificationBell urlBase={urlBase} fetchWithToken={fetchWithToken} />
        </div>

        {/*image and name*/}
        <UserAndLogOut />
      </div>
    </div>
  );
};

export default Navbar;
