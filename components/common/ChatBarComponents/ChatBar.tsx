"use client";

import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import axios from "axios"; // Import Axios for making HTTP requests
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/baseUrl";

interface ChatMessage {
  messagesWith: string;
  user: {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  lastMessage: string;
  date: string;
}

const ChatBar = () => {
  const [chats, setChats] = useState<ChatMessage[] | []>([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/chat`, {
          headers: { Authorization: token },
        });
        console.log(data);
        setChats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="">
      {chats.length > 0 &&
        chats.map((chat) => (
          <Chat
            key={chat.messagesWith}
            messageWith={chat.messagesWith}
            name={chat.user.username} // Replace with the user's name
            lastMessage={chat.lastMessage}
            lastMessageDate={chat.date}
          />
        ))}
    </div>
  );
};

export default ChatBar;
