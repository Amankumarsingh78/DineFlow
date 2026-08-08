import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiBarChart2,
  FiGrid,
  FiMenu,
  FiShoppingBag,
  FiTable,
  FiLogOut,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: FiBarChart2,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: FiGrid,
    },
    {
      label: "Foods",
      path: "/admin/foods",
      icon: FiShoppingBag,
    },
    {
      label: "Tables",
      path: "/admin/tables",
      icon: FiTable,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: FiMenu,
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl">
                🍽️
              </div>

              <div>
                <h1 className="text-lg font-bold">DineFlow</h1>
                <p className="text-xs text-slate-400">Restaurant Admin</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>

                <FiChevronRight className="ml-auto opacity-50" size={16} />
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <FiLogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:pl-72">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <FiMenu size={23} />
            </button>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Restaurant Management
              </p>

              <h2 className="text-lg font-bold text-slate-900">Admin Panel</h2>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {admin?.name || "Administrator"}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {admin?.role || "admin"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
              {(admin?.name?.charAt(0) || "A").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
