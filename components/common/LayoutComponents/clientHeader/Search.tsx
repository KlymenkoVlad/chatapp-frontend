"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiSearch } from "react-icons/bi";

interface ISearchProps {
  smallSearch?: boolean;
}
const Search = ({ smallSearch }: ISearchProps) => {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const searchInput = formElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement | null;
    router.push(`/search/${searchInput?.value}`);
    formElement.reset();
  };
  return (
    <form action="submit" onSubmit={handleSubmit}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
        <input
          type="search"
          id="default-search"
          className={`focus:shadow-outline h-12 invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none ${
            smallSearch ? "sm:w-[320px]" : "sm:w-[400px] lg:w-[550px]"
          } block rounded-lg border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 shadow-md`}
          placeholder="Find your friends..."
          required
        />

        <button
          type="submit"
          className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <div className="flex">
            <span className="mr-3 hidden">Search</span>

            <BiSearch className="h-4 w-4 text-white" />
          </div>
        </button>
      </div>
    </form>
  );
};

export default Search;
