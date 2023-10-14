import Image from "next/image";
import Link from "next/link";
import React from "react";
import Search from "./clientHeader/Search";

const Header = () => {
  return (
    <nav className="bg-white border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex">
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
        </div>

        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only "
        >
          Search
        </label>

        <Search />
      </div>
    </nav>
  );
};

export default Header;
