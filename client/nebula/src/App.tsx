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
import Page from "./views/project/pages/page";
import PageProvider from "./hooks/usePage";
import NotMatch from "./views/notMatch";
import PublicProjectView from "./views/publicProjectView";
import PublicPageView from "./components/publicPageView";
import StarredProjectsView from "./views/starredProjectsView";
import AuthCallback from "./components/AuthCallback";

function App() {
  return (
    <div data-testid="id" className="bg-bgLight dark:bg-bgDark h-screen">
      <Router>
        <AuthProvider>
          <ProjectProvider>
            <PageProvider>
              {" "}
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

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
                    <Route path="/starred" element={<StarredProjectsView />} />
                    <Route path="*" element={<NotMatch />} />
                    <Route
                      path="/project/creation"
                      element={<CreateProject />}
                    />
                  </Route>
                  <Route path="/projects" element={<Outlet />}>
                    <Route path=":projectId" element={<Project />}>
                      <Route path="pages/:pageId" element={<Page />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="/p/:slug" element={<PublicProjectView />} />
                <Route
                  path="/p/:slug/pages/:pageId"
                  element={<PublicPageView />}
                />
              </Routes>
            </PageProvider>
          </ProjectProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
