import Link from "next/link";
import React from "react";
import { MdArrowBack } from "react-icons/md";

const ButtonReturnSearchClient = () => {
  return (
    <Link href={"/"} className="mt-4 flex items-center justify-center">
      <div className="mr-2 h-[40px] w-[40px] inline-flex  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center  items-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <MdArrowBack className="text-2xl" />
      </div>
      <span className=" font-bold">Back to page with chats</span>
    </Link>
  );
};

export default ButtonReturnSearchClient;
