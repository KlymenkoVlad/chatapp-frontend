import { User } from "@/types/interfaces";
import type { Metadata } from "next";

import { baseUrl } from "@/utils/baseUrl";
import ButtonSearchClient from "./ButtonSearchClient";
import axios from "axios";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Search",
  description: "",
};

interface PageProps {
  params: { searchSlug: string };
}

export default async function Page({ params }: PageProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  console.log(token);
  const { data: users }: { data: User[] } = await axios.get(
    `${baseUrl}/api/user?username=${params.searchSlug}`,
    {
      headers: { Authorization: token?.value },
    }
  );

  //TODO: INSERT NAME

  return (
    <>
      <h1 className="text-3xl font-bold text-center ms:mt-24 mt-16">
        That's all we could find on your request{" "}
        <span className="text-blue-600">{params.searchSlug}</span>
      </h1>
      <div className="grid grid-cols-6 justify-items-center items-center gap-3 mx-14 mb-16 ms:mt-24 mt-16">
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
                      src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
                      alt="Jese Leos"
                    />
                  </a>
                  <div>
                    <ButtonSearchClient id={user._id} />
                  </div>
                </div>
                <p className="text-base font-semibold leading-none text-gray-900 ">
                  <a href="#">Jese Leos</a>
                </p>
                <p className="mb-3 text-sm font-normal">@{user.username}</p>
                <p className="mb-4 text-sm">
                  Open-source contributor. Building
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export const revalidate = 1;
