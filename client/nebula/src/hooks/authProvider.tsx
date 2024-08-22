/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>({});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => { return localStorage.getItem("site") || '' });

  const navigate = useNavigate();
  const loginAction = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (response.ok) {
        console.log('good')
        console.log(res)
        localStorage.setItem("site", res.access_token);
        navigate("/");
        return;
      }

      if (res.data) {
        console.log('start')
        console.log(localStorage)
        setUser(res.data.user);
        setToken(res.token);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
