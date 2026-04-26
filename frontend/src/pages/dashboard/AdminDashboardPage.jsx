import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const AdminDashboardPage = () => {
  const { auth } = useAuth();

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Admin ID</p>
          <p className="mt-2 break-all font-semibold text-gray-900">
            {auth?.userId || "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-2 break-all font-semibold text-gray-900">
            {auth?.email || "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Role</p>
          <p className="mt-2 font-semibold text-gray-900">{auth?.role || "-"}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Token Status</p>
          <p className="mt-2 font-semibold text-gray-900">
            {auth?.token ? "Stored successfully" : "Missing"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">JWT Token</p>
        <p className="mt-2 break-all text-sm font-medium text-gray-900">
          {auth?.token || "-"}
        </p>
      </div>

    </DashboardLayout>
  );
};

export default AdminDashboardPage;