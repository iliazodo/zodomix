import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ChatZone from "./pages/ChatZone.jsx";
import Explore from "./pages/Explore.jsx";
import Profile from "./pages/Profile.jsx";

import {Navigate , Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthContext } from "./context/AuthContext.jsx";
import VerifyZone from "./pages/VerifyZone.jsx";


function App() {

  const {authUser} = useAuthContext();


  return (
    <div className=" font-thin">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path={`/chatZone/:group`} element={<ChatZone/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login" />} />
        <Route path="/signUp" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/verify/:token" element={<VerifyZone/>} />
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
