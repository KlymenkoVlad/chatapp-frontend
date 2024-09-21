"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { Socket, io } from "socket.io-client";
import { toast } from "sonner";

import Chat from "./Chat";
import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import { IChat, IMessage, IUser } from "@/types/interfaces";
import LoadingChat from "./LoadingChat";
import truncateString from "@/utils/truncateString";

const ChatBar = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(true);

  const ChatsStore = useChatStore((state) => state.chats);
  const token = Cookies.get("token");
  const socket = useRef<Socket | null>();
  const updatedUserRef = useRef<{ user: IUser; msg: string }>();

  const handleNewMessage = async ({ newMsg }: { newMsg: IMessage }) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.user._id === newMsg.sender) {
          updatedUserRef.current = {
            user: chat.user,
            msg: newMsg.msg,
          };

          return {
            ...chat,
            lastMessage: newMsg.msg,
            date: new Date(),
          };
        } else {
          return chat;
        }
      }),
    );
  };

  useEffect(() => {
    setChats(ChatsStore as IChat[]);
  }, [ChatsStore]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId });
    }

    return () => {
      if (socket.current) {
        socket.current.emit("userDisconnect");
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("newMsgReceived", handleNewMessage);
    }

    return () => {
      if (socket.current) {
        socket.current.off("newMsgReceived", handleNewMessage);
      }
    };
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

  useEffect(() => {
    if (updatedUserRef.current) {
      const { user, msg } = updatedUserRef.current;

      toast(
        <div className="flex space-x-2">
          <Image
            className="h-12 w-12 rounded-full"
            id="userPhoto"
            src={
              user.mainPicture ? user.mainPicture : "/blank-profile-icon.webp"
            }
            alt="User photo"
            width={50}
            height={50}
          />

          <div>
            <h5 className="font-semibold">{user.name}</h5>
            <p>{truncateString(msg, 100)}</p>
          </div>
        </div>,
      );

      updatedUserRef.current = undefined;

      document.title = "New message!";

      const messageTimeout = setTimeout(() => {
        document.title = "All Chats";
      }, 3000);

      return () => clearTimeout(messageTimeout);
    }
  }, [chats]);

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
        <div className="mt-5 flex flex-col items-center justify-center text-center">
          <Image
            width={100}
            height={100}
            src="/no-chat-error.png"
            className="h-24 w-24"
            alt=""
          />
          <p className="mb-4 text-center text-2xl font-bold md:text-4xl">
            No messages yet.
          </p>
          <p className="">
            No messages in your inbox, yet! Start chatting with people around
            you. <span className="font-semibold">Look for them above</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatBar;
