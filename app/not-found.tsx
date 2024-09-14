import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-blue-700">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="mt-4 text-2xl">Page not found</p>
        <p className="mt-2 text-lg">
          The page you are looking for might have been removed, does not exist
          or will be implemented in future.
        </p>
        <Link
          className="mt-4 block font-extrabold text-blue-700 hover:underline"
          href="/"
        >
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
