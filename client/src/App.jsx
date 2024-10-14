import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./pages/Home/Home";
import "./App.css";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Verify from "./pages/Auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/About/About";
import Account from "./pages/Account/Account";
import { useAuthContext } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Course from "./pages/Course/Course";
import CourseDescription from "./pages/CourseDescription/CourseDescription";
import Dashboard from "./pages/Dashboard/Dashboard";
import CourseStudy from "./pages/CourseStudy/CourseStudy";
import Lecture from "./pages/Lecture/Lecture";
import AdminDashBoard from "./components/admin/dashboard/AdminDashBoard";
import AdminCourses from "./components/admin/courses/AdminCourses";
import AdminUsers from "./components/admin/users/AdminUsers";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

function App() {
  const { loading, isAuth, user } = useAuthContext();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            <Route path="/forgot" element={isAuth ? <Home /> : <ForgotPassword />} />
            <Route path="/resetpassword/:token" element={isAuth ? <Home /> : <ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Course />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route
              path="/course/:courseId"
              element={isAuth ? <CourseDescription user={user} /> : <Login />}
            />
            <Route
              path="/:userId/dashboard"
              element={isAuth ? <Dashboard /> : <Login />}
            />
            <Route
              path="/course/study/:courseId"
              element={isAuth ? <CourseStudy user={user} /> : <Login />}
            />
            <Route
              path="/lectures/:courseId/"
              element={isAuth ? <Lecture user={user} /> : <Login />}
            />
            <Route
              path="/admin/dashboard"
              element={isAuth ? <AdminDashBoard user={user} /> : <Login />}
            />
            <Route
              path="/admin/course"
              element={isAuth ? <AdminCourses user={user} /> : <Login />}
            />
            <Route
              path="/admin/users"
              element={isAuth ? <AdminUsers user={user} /> : <Login />}
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
