import React from "react";
import Search from "./clientHeader/Search";
import ProfileMenu from "./clientHeader/ProfileMenu";
import Link from "next/link";

const Header = () => {
  return (
    <header className="mx-auto flex max-w-screen-xl items-center justify-evenly border-gray-200 bg-white p-2">
      <Link
        href="/chat"
        className="text-3xl font-bold text-blue-600 transition-colors hover:text-blue-700"
      >
        Newchat
      </Link>
      <Search />
      <ProfileMenu />
    </header>
  );
};

export default Header;
