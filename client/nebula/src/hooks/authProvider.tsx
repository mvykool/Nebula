/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>({});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("site") || "";
  });

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

        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          console.error("User data is missing in the response");
        }

        navigate("/");
      } else {
        console.error("Login failed:", res.message);
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
    }
  };

  //create user
  const signupAction = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        navigate("/login");
        alert("user craeted, now login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // fetch user data
  const fetchUserData = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setToken("");
        localStorage.removeItem("site");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      fetchUserData();
    }
  }, [token, user, fetchUserData]);

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateUser = async (updateData: any) => {
    if (!token || !user?.sub) {
      console.log("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/" + user?.sub, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updateUserData = await response.json();
        const newUserData = { ...user, ...updateUserData };
        setUser(newUserData);
        localStorage.setItem("user", JSON.stringify(newUserData));
        return newUserData;
      } else {
        console.log("error");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const defaultPfp =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  return (
    <AuthContext.Provider
      value={{
        token,
        fetchUserData,
        user,
        loginAction,
        updateUser,
        signupAction,
        logOut,
        defaultPfp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
