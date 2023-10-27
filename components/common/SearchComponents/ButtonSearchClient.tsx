"use client";

import React from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import { IUser } from "@/types/interfaces";

const handleStartTalk = async (
  userIdReceiver: string,
  userId: string | undefined,
  username: string
) => {
  if (!userId) {
    console.error("no user id");
  }

  const { data } = await axios.post(`${baseUrl}/api/chat`, {
    userId,
    msgSendToUserId: userIdReceiver,
  });

  // Check if the chat entry already exists in the state
  const chatExists = useChatStore
    .getState()
    .chats.some((chat) => chat.messagesWith === data.messagesWith);

  if (!chatExists && typeof data.message !== "string") {
    const updatedChats = [...useChatStore.getState().chats, data];
    useChatStore.setState({ chats: updatedChats });
  }

  useChatStore.setState({ activeChatUsername: username });
};

interface ButtonSearchClientProps {
  user: IUser;
}

const ButtonSearchClient = ({ user }: ButtonSearchClientProps) => {
  const router = useRouter();
  const userId = useChatStore((state) => state.userId);

  return (
    <button
      type="button"
      onClick={() => {
        handleStartTalk(user._id, userId, user.username);
        router.push(`/chat/${user._id}`);
      }}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 "
    >
      Start talking
    </button>
  );
};

export default ButtonSearchClient;
