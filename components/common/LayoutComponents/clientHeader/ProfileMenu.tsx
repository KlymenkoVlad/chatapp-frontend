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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.id !== "userPhoto"
      ) {
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
    <button
      id="dropdownUserAvatarButton"
      data-dropdown-toggle="dropdownAvatar"
      onClick={() => setDropDownActive(!dropDownActive)}
      className="relative z-10 h-12 min-w-12 rounded-full text-sm focus:ring-4 focus:ring-gray-300"
      type="button"
    >
      {loading ? (
        <Image
          src="/blank-profile-icon.webp"
          className="h-12 w-12 animate-pulse rounded-full"
          alt="user photo"
          width={100}
          height={100}
        />
      ) : (
        user && (
          <>
            <Image
              className="h-12 w-12 rounded-full"
              id="userPhoto"
              src={
                user.mainPicture ? user.mainPicture : "/blank-profile-icon.webp"
              }
              alt="User photo"
              width={100}
              height={100}
            />

            <div
              ref={dropdownRef}
              id="dropdownAvatar"
              className={`top-14 z-10 text-left ${
                dropDownActive ? "right-0 opacity-100" : "opacity-0"
              } transition-opacity delay-150 duration-1000 ease-in-out ${
                dropDownActive ? "absolute" : "hidden"
              } w-44 divide-y divide-gray-100 rounded-lg bg-white shadow`}
            >
              <div className="px-4 py-3 text-sm text-gray-900">
                <div>
                  Hi, {user.name} {user?.lastname}
                </div>
                <div className="truncate font-medium">{user.email}</div>
              </div>
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownUserAvatarButton"
              >
                <li>
                  <Link
                    href="/settings"
                    onClick={() => setDropDownActive(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
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
          </>
        )
      )}
    </button>
  );
};

export default ProfileMenu;
