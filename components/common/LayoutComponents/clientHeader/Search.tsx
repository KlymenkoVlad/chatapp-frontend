"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
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
          className="h-12 sm:w-[400px] lg:w-[550px] block p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
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
