import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="bg-white border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Image
          src="/applogo.svg"
          className="mr-3"
          alt="NewMessenger Logo"
          width={60}
          height={60}
        />
        <span className="self-center text-2xl font-semibold whitespace-nowrap ">
          NewMessenger
        </span>
        <div className="flex items-center md:order-2">
          <Image
            className="w-8 h-8 rounded-full"
            src="/docs/images/people/profile-picture-3.jpg"
            alt="user photo"
            width={30}
            height={30}
          />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white ">
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
      </div>
    </nav>
  );
};

export default Header;
