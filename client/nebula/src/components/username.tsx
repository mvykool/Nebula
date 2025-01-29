import { useAuth } from "../hooks/authProvider";

const Username = () => {
  const { user, defaultPfp } = useAuth();

  return (
    <>
      <img
        src={user?.picture || defaultPfp}
        className="h-8 md:h-11 w-8 md:w-11 rounded-md"
        alt="user-picture"
      />
      <div className="flex items-center justify-between w-full">
        <p className="font-semibold hidden md:block">{user?.username}</p>
        <i className="bx bx-chevron-down"></i>
      </div>
    </>
  );
};

export default Username;
