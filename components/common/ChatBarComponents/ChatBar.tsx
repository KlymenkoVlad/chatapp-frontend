"use client";

import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import { IChat } from "@/types/interfaces";
import Image from "next/image";
import { Socket, io } from "socket.io-client";

const LoadingChat = () => {
  return (
    <div className="mx-auto mt-4 w-full min-w-[320px] max-w-[700px] rounded-md p-4 shadow">
      <div className="flex animate-pulse space-x-4">
        <div className="h-10 w-10 rounded-full bg-slate-300"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 rounded bg-slate-300"></div>
          </div>
          <div className="space-y-3">
            <div className="h-2 rounded bg-slate-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatBar = () => {
  const ChatsStore = useChatStore((state) => state.chats);
  const token = Cookies.get("token");
  const socket = useRef<Socket | null>();
  const userId = useChatStore((state) => state.userId);

  const [chats, setChats] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setChats(ChatsStore as IChat[]);
  }, [ChatsStore]);

  useEffect(() => {
    socket.current = io(baseUrl);
    if (socket.current) {
      socket.current.emit("join", { userId });
    }
  }, []);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    socket.current.on("newChatAccept", async (data) => {
      setChats((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${baseUrl}/api/chat`, {
          headers: { Authorization: token },
        });
        useChatStore.setState({ chats: data });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <LoadingChat />
          <LoadingChat />
          <LoadingChat />
        </>
      ) : chats && chats.length > 0 ? (
        chats.map((chat) => <Chat key={chat.messagesWith} {...chat} />)
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            width={150}
            height={150}
            src="/no-chat-error.png"
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-36 w-36"
            alt=""
          />
          <p className="text-center text-2xl font-bold md:text-5xl">
            No messages yet.
          </p>
          <p className="">
            No messages in your inbox, yet! Start chatting with people around
            you. You can find them above
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatBar;
