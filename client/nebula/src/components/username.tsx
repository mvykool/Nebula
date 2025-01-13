import { useAuth } from "../hooks/authProvider";

const Username = () => {
  const { user, defaultPfp } = useAuth();

  return (
    <>
      <img
        src={user?.picture || defaultPfp}
        className="h-11 w-11 rounded-md"
        alt="user-picture"
      />
      <p className="font-semibold">{user?.username}</p>
      <i className="bx bx-chevron-down"></i>
    </>
  );
};

export default Username;
