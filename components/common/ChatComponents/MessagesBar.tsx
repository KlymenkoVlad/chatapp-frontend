"use client";

//TODO: don`t work updating message, so need to fix

//TODO: problem is in the activeChat, it is null, so i better way is to get active chat from path, like paste here id

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/src/store";
import io from "socket.io-client"; // Import the socket.io-client library
import { baseUrl } from "@/utils/baseUrl";
import { Socket } from "socket.io-client"; // Import the Socket type
import Message from "./Message";
import { IMessage } from "@/types/interfaces";

const MessageBar = () => {
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [messageInput, setMessageInput] = useState("");
  const [userTyping, setUserTyping] = useState(null);
  const [typingTimer, setTypingTimer] = useState(null);

  const activeChat = useChatStore((state) => state.activeChatId);
  const activeChatUsername = useChatStore((state) => state.activeChatUsername);

  const userId = useChatStore((state) => state.userId);

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
    const loadMessages = () => {
      socket?.current.emit("loadMessages", {
        userId,
        receiver: activeChat,
        messagesWith: activeChat,
      });

      socket?.current.on("messagesLoaded", async ({ chat }) => {
        console.log(chat.messages);
        setMessages(chat.messages);
      });
    };

    if (socket.current && activeChat) loadMessages();
  }, [activeChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgSent", ({ newMsg }) => {
        console.log("msgSent emit");
        console.log(newMsg.sender, activeChat);
        if (newMsg.receiver === activeChat) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
        console.log("newMsgReceived emit");
        console.log(newMsg.sender, activeChat);
        if (newMsg.sender === activeChat) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });
    }
  }, []);

  useEffect(() => {
    socket.current.on("userTyping", (userId) => {
      console.log(userId, activeChat);

      if (userId === activeChat) {
        setUserTyping(activeChatUsername + " is typing...");
      }
    });

    socket.current.on("userStoppedTyping", () => {
      setUserTyping(null);
    });

    return () => {
      socket.current.off("userTyping");
      socket.current.off("userStoppedTyping");
    };
  }, [activeChat]);

  const handleTyping = (event) => {
    // Clear the previous timer if it exists
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    // Start a new timer
    const newTypingTimer = setTimeout(() => {
      // If this timer expires, the user stopped typing, so emit the "stopTyping" event
      socket.current.emit("stopTyping");
    }, 2000); // Adjust the time as needed (e.g., 2000 milliseconds = 2 seconds)

    // Update the typing timer in the state
    setTypingTimer(newTypingTimer);

    // Emit the "typing" event
    socket.current.emit("typing", userId, activeChat);
  };

  const handleStopTyping = () => {
    // Clear the timer when the user stops typing
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    // Emit the "stopTyping" event
    socket.current.emit("stopTyping");
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.current.emit("sendNewMsg", {
        userId,
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
                <Message key={index} userId={userId} {...message} />
              ))}
          </div>
        </div>
        <div className="mt-8 absolute bottom-10 w-[85%] right-10">
          {userTyping && <p className="mb-2">{userTyping}</p>}

          <div className="flex ">
            <input
              type="text"
              className="flex-1 py-2 px-3 rounded-full border outline-none focus:ring focus:ring-blue-400"
              placeholder="Type a message..."
              value={messageInput}
              onInput={handleTyping}
              onBlur={handleStopTyping}
              onChange={(e) => setMessageInput(e.target.value)}
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
    </div>
  );
};

export default MessageBar;
