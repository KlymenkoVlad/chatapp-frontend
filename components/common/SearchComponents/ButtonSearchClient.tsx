"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";

const handleStartTalk = async (userIdReceiver: string, userId?: string) => {
  if (!userId) {
    console.error("no user id");
  }

  const { data } = await axios.post(`${baseUrl}/api/chat`, {
    userId,
    msgSendToUserId: userIdReceiver,
  });

  if (typeof data.message !== "string") {
    useChatStore.setState({ chats: [...useChatStore.getState().chats, data] });
  }

  useChatStore.setState({ activeChat: userIdReceiver });
};

interface ButtonProps {
  id: string;
}

const ButtonSearchClient = ({ id }: ButtonProps) => {
  const router = useRouter();
  const userId = useChatStore((state) => state.userId);

  return (
    <button
      type="button"
      onClick={() => {
        handleStartTalk(id, userId);
        router.push("/");
      }}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 "
    >
      Start talking
    </button>
  );
};

export default ButtonSearchClient;
