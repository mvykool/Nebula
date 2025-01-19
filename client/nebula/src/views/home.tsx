import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "../components/welcome";
import { useProject } from "../hooks/useProject";
import { useAuth } from "../hooks/authProvider";
import MyProjects from "./project/myProjects";
import Loading from "../components/loading";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fetchMyProjects, myProjects } = useProject();
  const { user, accessToken, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeHome = async () => {
      // Wait for auth to be initialized and check both user and token
      if (!isInitialized) {
        return;
      }

      if (!user || !accessToken) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        await fetchMyProjects();
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure auth state is properly synchronized
    const timer = setTimeout(() => {
      initializeHome();
    }, 100);

    return () => clearTimeout(timer);
  }, [user, accessToken, isInitialized, fetchMyProjects, navigate]);

  // Show loading state while initializing or loading
  if (isLoading || !isInitialized) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // Redirect if no user or token
  if (!user || !accessToken) {
    return null;
  }

  return (
    <div>
      {myProjects.length > 0 ? (
        <MyProjects projects={myProjects} />
      ) : (
        <Welcome />
      )}
    </div>
  );
};
export default Home;
