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

  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();

  const urlBase = import.meta.env.VITE_URL;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem("access_token");
      const storedRefreshToken = localStorage.getItem("refresh_token");
      const storedUser = localStorage.getItem("user");

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

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

      if (!response.ok) {
        throw new Error(res.message || "Authentication failed");
      }

      try {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        setAccessToken(res.access_token);
        setRefreshToken(res.refresh_token);

        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        navigate("/");
      } catch (storageError) {
        console.error("Storage error:", storageError);
        throw new Error("Failed to save authentication data");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to be handled by the component
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

  const logOut = useCallback(() => {
    setUser(null);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("projects");
    localStorage.setItem("isAnonymous", "false");
    navigate("/login");
  }, [navigate]);

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
      }
      logOut();
      return null;
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
      console.log("No access token available");
      return;
    }

    try {
      const response = await fetch(`${urlBase}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Only logout if it's a 401 error
        if (response.status === 401) {
          logOut();
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Don't automatically logout on network errors
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && !user) {
      fetchUserData();
    }
  }, [accessToken, user, fetchUserData]);

  const defaultPfp =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  const loginWithGoogle = async () => {
    window.location.href = `${urlBase}/auth/google`;
  };

  const loginDemo = async () => {
    try {
      const response = await fetch(`${urlBase}/auth/demo`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Demo authentication failed");
      }

      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      localStorage.setItem("isDemo", "true");
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);

      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/");
    } catch (error) {
      console.error("Demo login error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setUser,
        setAccessToken,
        setRefreshToken,
        loginWithGoogle,
        loginDemo,
        accessToken,
        fetchUserData,
        user,
        loginAction,
        isInitialized,
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
