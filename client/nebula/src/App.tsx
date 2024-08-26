import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/privateRoute";
import AuthProvider from "./hooks/authProvider";
import Home from "./views/home";
import Login from "./views/auth/login";
import Profile from "./views/profile";
import SignUp from "./views/auth/singup";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
