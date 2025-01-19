import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authProvider";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const urlBase = import.meta.env.VITE_URL;
  const exchangeAttemptedRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple exchange attempts
      if (exchangeAttemptedRef.current) {
        return;
      }

      exchangeAttemptedRef.current = true;

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          throw new Error(`Authentication error: ${error}`);
        }

        if (!code) {
          throw new Error("No authentication code received");
        }

        const response = await fetch(`${urlBase}/auth/exchange-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Exchange failed: ${response.status}`);
        }

        const data = await response.json();

        // Store everything before navigation
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        if (data.data?.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }

        // Update state
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        if (data.data?.user) {
          setUser(data.data.user);
        }

        // Navigate with replace to clear the history stack
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error in auth callback:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed",
        );
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleCallback();

    // Cleanup function to prevent memory leaks
    return () => {
      exchangeAttemptedRef.current = true;
    };
  }, []); // Empty dependency array

  return (
    <div className="flex items-center justify-center min-h-screen bg-bgDark">
      {error ? (
        <div className="text-red-500 text-xl">
          <div>Authentication Error</div>
          <div className="text-sm mt-2">{error}</div>
        </div>
      ) : (
        <div className="text-white text-xl">Completing login...</div>
      )}
    </div>
  );
};

export default AuthCallback;
