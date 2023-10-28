import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center text-blue-700">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-2xl mt-4">Page not found</p>
        <p className="text-lg mt-2">
          The page you are looking for might have been removed, does not exist
          or will be implemented in future.
        </p>
        <Link
          className="text-blue-700 font-extrabold hover:underline mt-4 block"
          href="/"
        >
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
