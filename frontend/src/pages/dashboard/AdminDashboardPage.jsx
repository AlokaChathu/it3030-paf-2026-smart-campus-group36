import { useAuth } from "../../context/AuthContext";

const AdminDashboardPage = () => {
  const { auth, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Separate admin dashboard with globally accessible auth data.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Admin ID</p>
            <p className="mt-2 break-all font-semibold text-gray-900">
              {auth?.userId || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-2 break-all font-semibold text-gray-900">
              {auth?.email || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Role</p>
            <p className="mt-2 break-all font-semibold text-gray-900">
              {auth?.role || "-"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Token Status</p>
            <p className="mt-2 font-semibold text-gray-900">
              {auth?.token ? "Stored successfully" : "Missing"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">JWT Token</p>
          <p className="mt-2 break-all text-sm font-medium text-gray-900">
            {auth?.token || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;