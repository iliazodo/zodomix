import SignUp from "./pages/signup/SignUp.jsx";
import Login from "./pages/login/Login.jsx";
import Home from "./pages/home/Home.jsx";
import ChatZone from "./pages/chatZone/ChatZone.jsx";
import Explore from "./pages/explore/Explore.jsx";
import Profile from "./pages/profile/Profile.jsx";
import AddGroup from "./pages/addGroup/AddGroup.jsx";
import EditGroup from "./pages/editGroup/EditGroup.jsx";
import VerifyZone from "./pages/verifyingZone/VerifyZone.jsx";
import Robot from "./pages/robot/Robot.jsx";

import {Navigate , Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthContext } from "./context/AuthContext.jsx";

function App() {

  const {authUser} = useAuthContext();


  return (
    <div className=" font-thin">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path={`/chatZone/:groupName`} element={<ChatZone/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/robot" element={<Robot/>} />
        <Route path="/addGroup" element={<AddGroup/>} />
        <Route path="/edit/:groupId" element={<EditGroup/>} />
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
