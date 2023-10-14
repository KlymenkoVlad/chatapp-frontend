"use client";

import React from "react";
import { baseUrl } from "@/utils/baseUrl";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/src/store";
const handleStartTalk = async (userIdReceiver: string, userId: string) => {
  console.log("fasdf");
  console.log(userId, userIdReceiver);
  const { data } = await axios.post(`${baseUrl}/api/chat`, {
    userId,
    msgSendToUserId: userIdReceiver,
  });

  console.log(data);

  if (typeof data.message !== "string") {
    useChatStore.setState({ chats: [...useChatStore.getState().chats, data] });
  }

  useChatStore.setState({ activeChat: userIdReceiver });
};

interface Props {
  id: string;
}

const ButtonSearchClient = ({ id }: Props) => {
  const router = useRouter();
  const userId = localStorage.getItem("userId");

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
