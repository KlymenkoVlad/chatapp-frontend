import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="flex max-w-screen-xl justify-around items-center mx-auto py-4">
      <div className="">
        <p>© 2023 NewMessenger™. All Rights Reserved.</p>
      </div>

      <ul className="flex justify-between items-center w-1/6">
        <li>
          <Link
            href="/"
            className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 "
            aria-current="page"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 "
          >
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
