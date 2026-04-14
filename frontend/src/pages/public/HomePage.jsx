import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Smart Campus Hub</h1>
            <p className="mt-2 text-gray-600">
              Simple and professional campus management frontend.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;