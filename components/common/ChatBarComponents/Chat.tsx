"use client";

import Image from "next/image";
import React from "react";
import dateFormat from "@/utils/dateFormat";
import { useChatStore } from "@/src/store";
import { IChat } from "@/types/interfaces";

const Chat = ({ messagesWith, user, lastMessage, date }: IChat) => {
  const formattedDate = dateFormat(date);

  console.log(user.mainPicture);
  return (
    <div className="lg:w-[400px] w-[250px]  mx-auto bg-white shadow-md rounded-md mt-4 mb-2 hover:bg-slate-100 ">
      <div
        className="p-4 cursor-pointer"
        onClick={() => {
          useChatStore.setState({ activeChatId: messagesWith });
          useChatStore.setState({ activeChatUsername: user.username });
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src={user.mainPicture}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {`${user.name} ${user.lastname ? user.lastname : ""}`}
            </p>
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
