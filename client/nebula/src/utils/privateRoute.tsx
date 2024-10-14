import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/authProvider";
import { useEffect } from "react";

const PrivateRoute = () => {
  //setting night and light toggle
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const user = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;
