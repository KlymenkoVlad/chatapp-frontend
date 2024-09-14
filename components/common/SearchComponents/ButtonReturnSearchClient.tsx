import Link from "next/link";
import React from "react";
import { MdArrowBack } from "react-icons/md";

const ButtonReturnSearchClient = () => {
  return (
    <Link href={"/chat"} className="mt-4 flex items-center justify-center">
      <div className="mr-2 inline-flex h-[40px] w-[40px] items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <MdArrowBack className="text-2xl" />
      </div>
      <span className="font-bold">Back to page with chats</span>
    </Link>
  );
};

export default ButtonReturnSearchClient;
