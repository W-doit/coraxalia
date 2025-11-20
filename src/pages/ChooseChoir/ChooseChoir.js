import { Link } from "react-router-dom";

export default function ChooseChoir() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-400 to-orange-400 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Choose an Option
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            to="/create-choir"
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
          >
            Create New Choir
          </Link>

          <Link
            to="/join-choir"
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition duration-300"
          >
            Join Existing Choir
          </Link>
        </div>
      </div>
    </div>
  );
}
