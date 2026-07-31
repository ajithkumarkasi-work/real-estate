import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-brand">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-500">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-semibold text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
