"use client";

import Image from "next/image";
import React from "react";
import dateFormat from "@/utils/dateFormat";
import { useChatStore } from "@/src/store";

interface Chat {
  name: string;
  lastMessage?: string;
  lastMessageDate: string;
  messageWith: string;
}

const Chat = ({ name, lastMessage, lastMessageDate, messageWith }: Chat) => {
  // Call the dateFormat function and store its result in formattedDate

  const formattedDate = dateFormat(lastMessageDate);

  return (
    <div className="lg:w-[400px] w-[250px]  mx-auto bg-white shadow-md rounded-md mt-4 mb-2 hover:bg-slate-100 ">
      <div
        className="p-4 cursor-pointer"
        onClick={() => {
          useChatStore.setState({ activeChat: messageWith });
          localStorage.setItem("activeChat", messageWith);
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{name}</p>
            <p className="text-gray-500 text-sm">
              Last message: {lastMessage ? lastMessage : "No messages yet"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
