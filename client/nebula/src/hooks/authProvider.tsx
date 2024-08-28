/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>({});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
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

  //create user
  const signupAction = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });


      if (response.ok) {
        const res = await response.json();
        console.log(res.data)
        navigate("/login");
        alert("user craeted, now login")
      }

    } catch (error) {
      console.log(error)
    }
  }

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

  const updateUser = async (updateData: any) => {
    if (!token) {
      console.log('error')
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/" + user?.sub, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updateUserDate = await response.json();
        setUser(updateUserDate);
        console.log(user)
      } else {
        console.log('error')
      }

    } catch (error) {
      console.log(error)
    }
  }

  const defaultPfp = "https://i.pinimg.com/564x/4a/58/c8/4a58c821206a4b7534de8b3d4ed6ac85.jpg";

  return (
    <AuthContext.Provider value={{ token, user, loginAction, updateUser, signupAction, logOut, defaultPfp }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
