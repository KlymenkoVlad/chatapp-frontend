import Image from "next/image";
import React from "react";
import Search from "./clientHeader/Search";
import Link from "next/link";
const Header = () => {
  return (
    <nav className="bg-white border-gray-200 ">
      <div className="max-w-screen-xl flex items-center justify-evenly mx-auto p-4">
        <div className="space-y-2 cursor-pointer">
          <div className="w-8 h-0.5 bg-gray-600"></div>
          <div className="w-8 h-0.5 bg-gray-600"></div>
          <div className="w-8 h-0.5 bg-gray-600"></div>
        </div>
        <Search />
      </div>
    </nav>
  );
};

export default Header;
