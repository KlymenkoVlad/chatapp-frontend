import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";

import { baseUrl } from "@/utils/baseUrl";
import ButtonSearchClient from "@/components/common/SearchComponents/ButtonSearchClient";
import { IUser } from "@/types/interfaces";
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
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const users: IUser[] | undefined = await getData({
    token: token?.value,
    searchSlug: params.searchSlug,
  });

  //TODO: INSERT NAME

  return (
    <main>
      <div className="mx-3 text-center">
        <h1 className="mb-8 mt-16 text-3xl font-bold ms:mt-24">
          {users
            ? "That's all we could find on your request "
            : "We can`t find anything by your request "}
          <span className="text-blue-600">{params.searchSlug}</span>
        </h1>
        <ButtonReturnSearchClient />
      </div>
      <div className="mx-14 mb-16 mt-16 flex flex-wrap items-center justify-around gap-3 ms:mt-24">
        {users &&
          users.map((user) => (
            <div
              key={user._id}
              className="inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 shadow-md transition-opacity duration-300"
            >
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  {user.mainPicture ? (
                    <Image
                      className="h-12 w-12 rounded-full"
                      src={user.mainPicture}
                      alt="user photo"
                      width={50}
                      height={50}
                    />
                  ) : (
                    <Image
                      src="/blank-profile-icon.webp"
                      className="h-12 w-12 rounded-full"
                      alt="user photo"
                      width={50}
                      height={50}
                    />
                  )}
                  <div>
                    <ButtonSearchClient token={token} user={user} />
                  </div>
                </div>
                <p className="text-base font-semibold leading-none text-gray-900">
                  {`${user.name} ${user.lastname ? user.lastname : ""}`}
                </p>
                <p className="mb-3 text-sm font-normal">@{user.username}</p>
                {/* <p className="mb-4 text-sm">TODO: Implement user description</p> */}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
