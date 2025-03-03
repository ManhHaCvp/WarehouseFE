import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-day-picker/dist/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.scss";
//instance
import instance from "./utils/index";

import HomePage from "./pages/main/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

import NotFoundPage from "./pages/error/NotFoundPage";
import ComingSoon from "./pages/error/ComingSoon";
import AdminLayout from "./components/admin/Layout";
import ManageUser from "./components/admin/ManageUser";
import Dashboard from "./pages/admin/Dashboard";
import ManageBrand from "./pages/admin/ManageBrand";
import ManageCategory from "./pages/admin/ManageCategory";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageUserDetail from "./pages/admin/ManageUserDetail";

export const UserContext = createContext({});

function App() {
  const location = useLocation();
  const [userAuth, setUserAuth] = useState(null);
  const isAdminRoute = location.pathname.includes("/admin");
  const isUserRoute = location.pathname.includes("/user");
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    console.log(user);
    if (user) {
      setUserAuth(JSON.parse(user));
    } else {
      setUserAuth(null);
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Toaster />
        {!isAdminRoute && !isLoginPage && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" />} />

            <Route path="/login" element={!userAuth?.user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!userAuth?.user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={!userAuth?.user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
            <Route path="/user/profile" element={userAuth?.user ? <UserProfile /> : <Navigate to="/login" />} />

            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/brands" element={<ManageBrand />} />
              <Route path="/admin/categories" element={<ManageCategory />} />
              <Route path="/admin/products" element={<ManageProduct />} />
              <Route path="/admin/user/:id" element={<ManageUserDetail />} />
              <Route path="/admin/users" element={<ManageUser />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!isAdminRoute && !isUserRoute && !isLoginPage && <Footer />}
      </UserContext.Provider>
    </>
  );
}

export default App;
