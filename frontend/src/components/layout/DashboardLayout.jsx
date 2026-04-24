import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Bell,
  Users,
  Shield,
  LogOut,
  CalendarPlus,
  CalendarDays,
} from "lucide-react";
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
    {
      name: "Create Booking",
      path: "/user/bookings/new",
      icon: CalendarPlus,
    },
    {
      name: "My Bookings",
      path: "/user/bookings",
      icon: CalendarDays,
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
      name: "Bookings",
      path: "/admin/bookings",
      icon: CalendarDays,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-slate-200/60 bg-white shadow-sm lg:flex lg:flex-col">
          <div className="border-b border-slate-200/60 px-6 py-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white shadow-sm transition-shadow hover:shadow-md">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-slate-900">
                  Smart Campus Hub
                </p>
                <p className="text-xs text-slate-500">
                  {isAdmin ? "Admin Panel" : "User Panel"}
                </p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-5">
            <div className="rounded-xl bg-blue-50/50 p-4 ring-1 ring-blue-100">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                Signed in as
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {auth?.email || "-"}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600">
                Role: {auth?.role || "-"}
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-1.5">
              {links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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

          <div className="border-t border-slate-200/60 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <header className="border-b border-slate-200/60 bg-white px-6 py-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Welcome, {auth?.email || "User"}
                </p>
              </div>

              <div className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
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