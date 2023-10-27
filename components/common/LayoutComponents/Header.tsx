import Image from "next/image";
import React from "react";
import Search from "./clientHeader/Search";
import Link from "next/link";
import { tokenCheckClient } from "@/utils/authorizationCheck";
import ProfileMenu from "./clientHeader/ProfileMenu";
import { baseUrl } from "@/utils/baseUrl";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
async function getData(token: RequestCookie | undefined) {
  try {
    if (!token) {
      throw new Error("Failed to get token");
    }

    const res = await fetch(`${baseUrl}/api/login`, {
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}
const Header = async () => {
  //TODO: Not work showing of header when i go from login page
  const token = tokenCheckClient(false);
  const user = await getData(token);

  return (
    token && (
      <nav className="bg-white border-gray-200 ">
        <div className="max-w-screen-xl flex items-center justify-evenly mx-auto p-2">
          <Search />
          <ProfileMenu user={user} />
        </div>
      </nav>
    )
  );
};

export default Header;
