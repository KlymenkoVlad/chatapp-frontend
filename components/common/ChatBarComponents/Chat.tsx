"use client";

import Image from "next/image";
import React from "react";
import dateFormat from "@/utils/dateFormat";
import { useChatStore } from "@/src/store";
import { IChat } from "@/types/interfaces";
import truncateString from "@/utils/truncateString";
import Link from "next/link";

const Chat = ({ messagesWith, user, lastMessage, date }: IChat) => {
  return (
    <div className="mx-auto mb-2 mt-4 w-full min-w-[320px] max-w-[700px] rounded-md bg-white shadow-md transition delay-100 duration-300 ease-in-out hover:bg-slate-100">
      <Link href={`/chat/${messagesWith}`} shallow={true}>
        <div
          className="cursor-pointer p-4"
          onClick={() => {
            useChatStore.setState({ activeChatUsername: user.username });
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {user.mainPicture ? (
                <Image
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                  src={user.mainPicture}
                  alt="user photo"
                />
              ) : (
                <Image
                  width={40}
                  height={40}
                  src="/blank-profile-icon.webp"
                  className="h-12 w-12 rounded-full"
                  alt="user photo"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {`${user.name} ${user.lastname ? user.lastname : ""}`}
              </p>
              <p className="text-sm text-gray-500">
                Last message:{" "}
                {lastMessage
                  ? truncateString(lastMessage, 20)
                  : "No messages yet"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {date && dateFormat(date)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Chat;
