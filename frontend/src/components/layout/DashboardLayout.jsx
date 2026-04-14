import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, Bell, Users, Shield, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ title, children }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = auth?.role === "ADMIN";

  const userLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: User,
    },
    {
      name: "Notifications",
      path: "/user/notifications",
      icon: Bell,
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: User,
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-gray-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-gray-200 px-6 py-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-gray-900 p-2 text-white">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Smart Campus Hub</p>
                <p className="text-xs text-gray-500">
                  {isAdmin ? "Admin Panel" : "User Panel"}
                </p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-5">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Signed in as</p>
              <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                {auth?.email || "-"}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-600">
                Role: {auth?.role || "-"}
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-2">
              {links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Welcome, {auth?.email || "User"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {auth?.role || "-"}
              </div>
            </div>
          </header>

          <section className="p-6">{children}</section>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;