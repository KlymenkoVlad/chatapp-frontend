import Link from "next/link";
import React from "react";

const ButtonReturnSearchClient = () => {
  return (
    <Link href={"/"}>
      <div className="mt-4 mr-2 h-[40px] w-[40px] inline-flex  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center  items-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg
          className="w-4 h-4 rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </div>
      <span className=" font-bold">Back to page with chats</span>
    </Link>
  );
};

export default ButtonReturnSearchClient;
