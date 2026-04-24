import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Unauthorized</h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to access this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;