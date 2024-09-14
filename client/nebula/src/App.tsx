import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import PrivateRoute from "./utils/privateRoute";
import AuthProvider from "./hooks/authProvider";
import ProjectProvider from "./hooks/useProject";
import Home from "./views/home";
import Login from "./views/auth/login";
import Profile from "./views/profile";
import SignUp from "./views/auth/signup";
import CreateProject from "./views/project/create";
import ExploreView from "./views/explore/exploreView";
import Layout from "./views/layout";
import Project from "./views/project/project";

function App() {
  return (
    <div className="bg-bgLight dark:bg-bgDark h-screen">
      <Router>
        <AuthProvider>
          <ProjectProvider>
            {" "}
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/explore" element={<ExploreView />} />
                  <Route path="/project/creation" element={<CreateProject />} />
                  <Route path="/projects/">
                    <Route path=":projectId" element={<Project />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </ProjectProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
