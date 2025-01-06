import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "../types/contexts.type";
import { User } from "../types/user.type";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("access_token") || "";
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem("refresh_token") || "";
  });

  const navigate = useNavigate();

  const urlBase = import.meta.env.VITE_URL;
  console.log(urlBase);

  const loginAction = async (data: { username: string; password: string }) => {
    try {
      const response = await fetch(`${urlBase}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        setAccessToken(res.access_token);
        setRefreshToken(res.refresh_token);

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
  const signupAction = async (data: { username: string; password: string }) => {
    try {
      const response = await fetch(`${urlBase}/user`, {
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

  const logOut = () => {
    setUser(null);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateUser = async (updateData: Partial<User>) => {
    if (!accessToken || !user?.sub) {
      console.log("error");
      return;
    }

    try {
      const response = await fetch(`${urlBase}/user/` + user?.sub, {
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

  //refresh token logic
  const refreshTokens = useCallback(async () => {
    if (!refreshToken) return;

    try {
      const response = await fetch(`${urlBase}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const res = await response.json();
        localStorage.setItem("site", res.access_token);
        localStorage.setItem("refreshToken", res.refresh_token);
        setAccessToken(res.access_token);
        setRefreshToken(res.refresh_token);
        return res.access_token;
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logOut();
    }
  }, [refreshToken]);

  const fetchWithToken = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const currentToken = accessToken;

      const makeRequest = async (token: string) => {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          const newToken = await refreshTokens();
          if (newToken) {
            return makeRequest(newToken);
          } else {
            throw new Error("Authentication failed");
          }
        }

        return response;
      };

      return makeRequest(currentToken);
    },
    [accessToken, refreshTokens],
  );

  // Use fetchWithToken in your fetchUserData function
  const fetchUserData = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      const response = await fetchWithToken(`${urlBase}/auth/profile`);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logOut();
    }
  }, [accessToken, fetchWithToken]);

  useEffect(() => {
    if (accessToken && !user) {
      fetchUserData();
    }
  }, [accessToken, user, fetchUserData]);

  const defaultPfp =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        fetchUserData,
        user,
        loginAction,
        updateUser,
        signupAction,
        logOut,
        defaultPfp,
        fetchWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
