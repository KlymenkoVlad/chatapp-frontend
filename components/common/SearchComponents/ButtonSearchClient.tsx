"use client";

import React, { useRef } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import { IUser } from "@/types/interfaces";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { toast } from "sonner";
import { Socket, io } from "socket.io-client";

interface ButtonSearchClientProps {
  user: IUser;
  token?: RequestCookie;
}

const ButtonSearchClient = ({ user, token }: ButtonSearchClientProps) => {
  if (!token) {
    redirect("/login");
  }
  const router = useRouter();
  const userId = useChatStore((state) => state.userId);
  const socket = useRef<Socket | null>();

  const handleStartTalk = async (
    userIdReceiver: string,
    userId: string | undefined,
    username: string,
    token: RequestCookie,
  ) => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    const { data, status } = await axios.post(
      `${baseUrl}/api/chat`,
      {
        userId,
        msgSendToUserId: userIdReceiver,
      },
      { headers: { Authorization: token.value } },
    );

    // Check if the chat entry already exists in the state
    const chatExists = useChatStore
      .getState()
      .chats.some((chat) => chat.messagesWith === data.messagesWith);

    //TODO Check if all works properly
    if (!chatExists && status === 201) {
      socket.current.emit("start-talk", { userIdReceiver, userId });
      const updatedChats = [...useChatStore.getState().chats, data];
      useChatStore.setState({ chats: updatedChats });
    }

    useChatStore.setState({ activeChatUsername: username });
  };

  return (
    <button
      type="button"
      onClick={() => {
        handleStartTalk(user._id, userId, user.username, token);
        toast.success("Here's your chat with " + user.username);
        router.push(`/chat/${user._id}`);
      }}
      className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
    >
      Start talking
    </button>
  );
};

export default ButtonSearchClient;
