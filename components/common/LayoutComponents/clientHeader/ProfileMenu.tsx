"use client";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { IUser } from "@/types/interfaces";
const ProfileMenu = ({ user }: { user: IUser }) => {
  const [dropDownActive, setDropDownActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDownActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        id="dropdownUserAvatarButton"
        data-dropdown-toggle="dropdownAvatar"
        onClick={() => setDropDownActive(!dropDownActive)}
        className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 "
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        {user.mainPicture ? (
          <img
            className="w-12 h-12 rounded-full"
            src={user.mainPicture}
            alt="user photo"
          />
        ) : (
          <img
            src="/blank-profile-icon.webp"
            className="w-12 h-12 rounded-full"
            alt="user photo"
          />
        )}
      </button>

      <div
        ref={dropdownRef}
        id="dropdownAvatar"
        className={`z-10 -left-28 ${
          dropDownActive ? "opacity-100" : "opacity-0"
        } transition-opacity ease-in-out delay-150 duration-1000 ${
          dropDownActive ? "absolute" : "hidden"
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 `}
      >
        <div className="px-4 py-3 text-sm text-gray-900 ">
          <div>
            {user.name} {user?.lastname}
          </div>
          <div className="font-medium truncate">{user.email}</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 "
          aria-labelledby="dropdownUserAvatarButton"
        >
          <li>
            <Link
              href="/settings"
              className="block px-4 py-2 hover:bg-gray-100 "
            >
              Settings
            </Link>
          </li>
          <li className="block px-4 py-2 hover:bg-gray-100 ">
            <button
              onClick={() => {
                Cookies.remove("token");
                router.push("/login");
              }}
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileMenu;
