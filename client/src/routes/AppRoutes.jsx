import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Menu from "../pages/Menu";
import AdminLogin from "../pages/AdminLogin";

import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Foods from "../pages/admin/Foods";
import Tables from "../pages/admin/Tables";
import Orders from "../pages/admin/Orders";

import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />

            <Route path="/admin/categories" element={<Categories />} />

            <Route path="/admin/foods" element={<Foods />} />

            <Route path="/admin/tables" element={<Tables />} />

            <Route path="/admin/orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
