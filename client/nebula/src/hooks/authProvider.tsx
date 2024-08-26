/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, createContext, useState, useEffect } from "react";
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

        localStorage.setItem("site", res.access_token);
        setToken(res.access_token);

        // Ensure res.data and res.data.user exist before setting state
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          console.error('User data is missing in the response');
        }

        navigate("/");
      } else {
        console.error('Login failed:', res.message);
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // fetch user data 
  const fetchUserData = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log(userData)
      } else {
        // If the token is invalid, clear it
        setToken('');
        localStorage.removeItem("site");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

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
