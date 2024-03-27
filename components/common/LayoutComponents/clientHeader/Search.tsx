"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { toast } from "sonner";
const Search = ({ smallSearch }: { smallSearch: boolean }) => {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const searchInput = formElement.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement | null;
    router.push(`/search/${searchInput?.value}`);
    formElement.reset();
  };
  return (
    <form action="submit" onSubmit={handleSubmit}>
      <div className="relative ">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
        <input
          type="search"
          id="default-search"
          className={`focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500 focus:shadow-outline  h-12 ${
            smallSearch ? "sm:w-[320px]" : "sm:w-[400px] lg:w-[550px]"
          }  shadow-md block p-4 pl-10 text-sm text-gray-900  border-gray-300 rounded-lg bg-gray-50   `}
          placeholder="Find your friends..."
          required
        />

        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
        >
          <div className="flex">
            <span className="hidden mr-3">Search</span>

            <BiSearch className="w-4 h-4 text-white " />
          </div>
        </button>
      </div>
    </form>
  );
};

export default Search;
