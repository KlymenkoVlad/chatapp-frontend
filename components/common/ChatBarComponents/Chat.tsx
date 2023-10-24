"use client";

import Image from "next/image";
import React from "react";
import dateFormat from "@/utils/dateFormat";
import { useChatStore } from "@/src/store";
import { IChat } from "@/types/interfaces";
import truncateString from "@/utils/truncateString";
import Link from "next/link";

const Chat = ({ messagesWith, user, lastMessage, date }: IChat) => {
  const formattedDate = dateFormat(date);

  return (
    <div className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-300 max-w-[700px] min-w-[320px] w-full  mx-auto bg-white shadow-md rounded-md mt-4 mb-2 hover:bg-slate-100 ">
      <Link href={`/chat/${messagesWith}`} shallow={true}>
        <div
          className="p-4 cursor-pointer"
          onClick={() => {
            // useChatStore.setState({ activeChatId: messagesWith });
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
                Last message:{" "}
                {lastMessage
                  ? truncateString(lastMessage, 20)
                  : "No messages yet"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{formattedDate}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Chat;
