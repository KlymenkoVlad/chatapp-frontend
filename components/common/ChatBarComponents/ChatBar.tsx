"use client";

import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import axios from "axios"; // Import Axios for making HTTP requests
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import { IChat } from "@/types/interfaces";

const ChatBar = () => {
  //Get Chat from zustand
  const ChatsStore = useChatStore((state) => state.chats);
  const token = Cookies.get("token");

  // Need to use to prevent error with rehydration
  const [chats, setChats] = useState<IChat[]>([]);

  // Need to use to prevent error with rehydration
  useEffect(() => {
    setChats(ChatsStore as IChat[]);
  }, [ChatsStore]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/chat`, {
          headers: { Authorization: token },
        });
        console.log(data);
        useChatStore.setState({ chats: data });
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div>
      {chats &&
        chats.length > 0 &&
        chats.map((chat) => <Chat key={chat.messagesWith} {...chat} />)}
    </div>
  );
};

export default ChatBar;
