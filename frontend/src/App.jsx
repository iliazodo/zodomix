import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ChatZone from "./pages/ChatZone.jsx";
import Explore from "./pages/Explore.jsx";
import Profile from "./pages/Profile.jsx";

import {Navigate , Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthContext } from "./context/AuthContext.jsx";


function App() {

  const {authUser} = useAuthContext();


  return (
    <div className=" font-thin">
      <Routes>
        <Route path="/" element={authUser ? <Home/> : <Navigate to="/login" />} />
        <Route path={`/chatZone/*`} element={authUser ? <ChatZone/> : <Navigate to="/login" />} />
        <Route path="/explore" element={authUser ? <Explore/> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login" />} />
        <Route path="/signUp" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "black",
            color: "white",
          },
        }}
      />
    </div>
  );
}

export default App;
