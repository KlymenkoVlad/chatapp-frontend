"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { IUser } from "@/types/interfaces";
import { baseUrl } from "@/utils/baseUrl";
import { ImSpinner2 } from "react-icons/im";
import { useChatStore } from "@/src/store";
import Image from "next/image";
import { toast } from "sonner";

async function getData(token?: string) {
  try {
    if (!token) {
      return new Error("Failed to get token");
    }

    const res = await fetch(`${baseUrl}/api/login`, {
      method: "GET",
      headers: {
        Authorization: token,
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
const ProfileMenu = () => {
  const [dropDownActive, setDropDownActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
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

  const [user, setUser] = useState<IUser | undefined>(undefined);
  useEffect(() => {
    setLoading(true);
    getData(token).then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? (
        <Image
          src="/blank-profile-icon.webp"
          className="w-12 h-12 rounded-full animate-pulse"
          alt="user photo"
          width={50}
          height={50}
        />
      ) : (
        user && (
          <div className="relative">
            <button
              id="dropdownUserAvatarButton"
              data-dropdown-toggle="dropdownAvatar"
              onClick={() => setDropDownActive(!dropDownActive)}
              className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 "
              type="button"
            >
              {user.mainPicture ? (
                <Image
                  className="w-12 h-12 rounded-full"
                  src={user.mainPicture}
                  alt="user photo"
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src="/blank-profile-icon.webp"
                  className="w-12 h-12 rounded-full"
                  alt="user photo"
                  width={50}
                  height={50}
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
                    onClick={() => setDropDownActive(false)}
                    className="block px-4 py-2 hover:bg-gray-100 "
                  >
                    Settings
                  </Link>
                </li>
                <li className="block px-4 py-2 hover:bg-gray-100">
                  <button
                    onClick={() => {
                      Cookies.remove("token");
                      useChatStore.setState({ userId: "", chats: [] });
                      setDropDownActive(false);
                      toast.success("Logged out successfully");
                      router.push("/login");
                    }}
                    className="w-full text-left"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ProfileMenu;
