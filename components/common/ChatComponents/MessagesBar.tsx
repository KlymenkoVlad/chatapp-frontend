"use client";

//TODO: don`t work updating message, so need to fix

//TODO: problem is in the activeChat, it is null, so i better way is to get active chat from path, like paste here id

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/src/store";
import io from "socket.io-client"; // Import the socket.io-client library
import { baseUrl } from "@/utils/baseUrl";
import axios from "axios";
import Cookies from "js-cookie";
import dateFormat from "@/utils/dateFormat";
import { string } from "yup";
import { Socket } from "socket.io-client"; // Import the Socket type
import Message from "./Message";

interface IMessage {
  date: string;
  _id: string;
  msg: string;
  receiver: string;
  sender: string;
}

const MessageBar = () => {
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [messageInput, setMessageInput] = useState("");

  const activeChat = useChatStore((state) => state.activeChat);

  const socket = useRef<Socket | null>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // When the component mounts, join the chat room
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: localStorage.getItem("userId") });
    }

    return () => {
      if (socket.current) {
        socket.current.emit("userDisconnect");
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    const loadMessages = () => {
      if (!socket.current) {
        socket.current = io(baseUrl);
      }
      socket?.current.emit("loadMessages", {
        userId: localStorage.getItem("userId"),
        receiver: activeChat,
        messagesWith: activeChat,
      });

      socket?.current.on("messagesLoaded", async ({ chat }) => {
        setMessages(chat.messages);
      });
    };

    if (socket.current && activeChat) loadMessages();
  }, [activeChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgSent", ({ newMsg }) => {
        console.log("msgSent emit");
        console.log(newMsg.sender, localStorage.getItem("activeChat"));
        if (newMsg.receiver === localStorage.getItem("activeChat")) {
          setMessages((prev) => [...prev, newMsg]);

          // setChats((prev) => {
          //   const previousChat = prev.find(
          //     (chat) => chat.messagesWith === newMsg.receiver
          //   );
          //   previousChat.lastMessage = newMsg.msg;
          //   previousChat.date = newMsg.date;

          //   return [...prev];
          // });
        }
      });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
        console.log("newMsgReceived emit");
        console.log(newMsg.sender, localStorage.getItem("activeChat"));
        if (newMsg.sender === localStorage.getItem("activeChat")) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });
    }
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      if (!socket.current) {
        socket.current = io(baseUrl);
      }
      socket.current.emit("sendNewMsg", {
        userId: localStorage.getItem("userId"),
        msgSendToUserId: activeChat, // Replace with the recipient's ID
        msg: messageInput,
      });

      // Update the local state for immediate display
      console.log(messages);
      setMessageInput("");
    }
  };

  return (
    <div
      className={`ml-4 w-full min-h-[70vh] mx-auto bg-white shadow-md rounded-md relative`}
    >
      <div className="p-4">
        <div
          className="overflow-y-auto h-[70vh] mb-24 px-4"
          ref={messagesContainerRef}
        >
          <div className="space-y-2">
            {messages &&
              messages.map((message, index) => (
                <Message
                  key={index}
                  userId={localStorage.getItem("userId")}
                  {...message}
                />
              ))}
          </div>
        </div>
        <div className="mt-4 flex absolute bottom-10 w-[85%] right-10">
          <input
            type="text"
            className="flex-1 py-2 px-3 rounded-full border outline-none focus:ring focus:ring-blue-400"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            className="ml-2 py-2 px-4 bg-blue-500 text-white rounded-full"
            onClick={handleSendMessage}
          >
            Send to
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
