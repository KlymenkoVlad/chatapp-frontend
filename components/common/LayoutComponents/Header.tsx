"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Search from "./clientHeader/Search";
import ProfileMenu from "./clientHeader/ProfileMenu";

const Header = () => {
  //TODO: Not work showing of header when i go from login page
  const pathname = usePathname();
  const showHeader = pathname !== "/login" && pathname !== "/signup";

  return (
    showHeader && (
      <header className="bg-white border-gray-200 ">
        <div className="max-w-screen-xl flex items-center justify-evenly mx-auto p-2">
          <Search />
          <ProfileMenu />
        </div>
      </header>
    )
  );
};

export default Header;
