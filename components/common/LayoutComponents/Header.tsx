import React from "react";
import Search from "./clientHeader/Search";
import ProfileMenu from "./clientHeader/ProfileMenu";
import Link from "next/link";

const Header = () => {
  return (
    <header className="mx-auto flex max-w-screen-xl items-center justify-between gap-x-2 border-gray-200 bg-white p-2 sm:gap-x-10">
      <Link
        href="/chat"
        className="hidden text-3xl font-bold text-blue-600 transition-colors hover:text-blue-500 sm:block"
      >
        Newchat
      </Link>
      <Search />
      <ProfileMenu />
    </header>
  );
};

export default Header;
