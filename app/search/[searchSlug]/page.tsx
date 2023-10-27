import type { Metadata } from "next";
import axios from "axios";
import { cookies } from "next/headers";

import { baseUrl } from "@/utils/baseUrl";
import ButtonSearchClient from "@/components/common/SearchComponents/ButtonSearchClient";
import { IUser } from "@/types/interfaces";
import { tokenCheckClient } from "@/utils/authorizationCheck";
import { redirect } from "next/navigation";
import ButtonReturnSearchClient from "@/components/common/SearchComponents/ButtonReturnSearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Find your friends",
};

interface PageProps {
  params: { searchSlug: string };
}

interface getDataProps {
  token?: string;
  searchSlug: string;
}

async function getData({
  token,
  searchSlug,
}: getDataProps): Promise<IUser[] | undefined> {
  try {
    if (!token) {
      throw new Error("Failed to get token");
    }

    const res = await fetch(`${baseUrl}/api/user?username=${searchSlug}`, {
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

export default async function Page({ params }: PageProps) {
  tokenCheckClient();

  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const users: IUser[] | undefined = await getData({
    token: token?.value,
    searchSlug: params.searchSlug,
  });

  //TODO: INSERT NAME

  return (
    <>
      <div className="text-center mx-3">
        <h1 className="text-3xl font-bold ms:mt-24 mt-16 mb-2">
          {users
            ? "That's all we could find on your request "
            : "We can`t find anything by your request "}
          <span className="text-blue-600">{params.searchSlug}</span>
        </h1>
        <ButtonReturnSearchClient />
      </div>
      <div className="flex justify-around items-center gap-3 mx-14 mb-16 ms:mt-24 mt-16 flex-wrap">
        {users &&
          users.map((user) => (
            <div
              key={user._id}
              className="inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-md  "
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <a href="#">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.mainPicture}
                      alt={user.username}
                    />
                  </a>
                  <div>
                    <ButtonSearchClient user={user} />
                  </div>
                </div>
                <p className="text-base font-semibold leading-none text-gray-900 ">
                  <a href="#">
                    {`${user.name} ${user.lastname ? user.lastname : ""}`}
                  </a>
                </p>
                <p className="mb-3 text-sm font-normal">@{user.username}</p>
                {/* <p className="mb-4 text-sm">TODO: Implement user description</p> */}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
