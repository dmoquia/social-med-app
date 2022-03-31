import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Profile from "./components/pages/Profile";
import CreatePost from "./components/CreatePost";
import reducer from "./reducer/userReducer";
import UserProfile from "./components/UserProfile";
import SubscribeUserPost from "./components/pages/SubscribeUserPost";
import Reset from "./components/pages/Reset";
import NewPassword from "./components/NewPassword";
export const UserContext = createContext();

const Routing = () => {
  const history = useNavigate();
  const { dispatch } = useContext(UserContext);

  // const getUserFromLocalStorage = () => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   return user
  //     ? dispatch({ type: "USER", payload: user })
  //     : !window.location.pathname.startsWith("reset")
  //     ? history("/sigin")
  //     : history("/reset");
  // };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history("/");
    } else {
      // history("/signin")
      if (!window.location.pathname.startsWith("/reset")) history("/signin");
    }
    // getUserFromLocalStorage();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/create" element={<CreatePost />}></Route>
      <Route path="/profile/:userid" element={<UserProfile />}></Route>
      <Route path="/myfollowingpost" element={<SubscribeUserPost />}></Route>
      <Route path="/reset" element={<Reset />}></Route>
      <Route path="/reset/:token" element={<NewPassword />}></Route>
    </Routes>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
