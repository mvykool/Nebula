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
      <p className="font-semibold hidden md:block">{user?.username}</p>
      <i className="bx bx-chevron-down"></i>
    </>
  );
};

export default Username;
