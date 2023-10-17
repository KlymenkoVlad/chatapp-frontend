"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/src/store";
import io from "socket.io-client";
import { baseUrl } from "@/utils/baseUrl";
import { Socket } from "socket.io-client";
import Message from "./Message";
import { IMessage } from "@/types/interfaces";

const MessageBar = () => {
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [messageInput, setMessageInput] = useState("");
  const [userTyping, setUserTyping] = useState<undefined | string>(undefined);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const activeChatId = useChatStore((state) => state.activeChatId);
  const activeChatUsername = useChatStore((state) => state.activeChatUsername);
  const userId = useChatStore((state) => state.userId);

  const socket = useRef<Socket | null>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the messages container if new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // When the component mounts, join the chat room and disconnect.
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

  // Load the messages for the current chat
  useEffect(() => {
    const loadMessages = () => {
      if (!socket.current) return;
      socket?.current.emit("loadMessages", {
        userId,
        receiver: activeChatId,
        messagesWith: activeChatId,
      });

      socket?.current.on("messagesLoaded", async ({ chat }) => {
        console.log(chat.messages);
        setMessages(chat.messages);
      });
    };

    if (socket.current && activeChatId) loadMessages();
  }, [activeChatId]);

  // If a message is sent, add it to the list of messages
  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("msgSent", ({ newMsg }) => {
      console.log("activeChatId", activeChatId);
      console.log("newMsg", newMsg);
      if (newMsg.receiver === activeChatId) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  }, [activeChatId]);

  // If a message is received, add it to the list of messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        console.log("activeChatId", activeChatId);
        console.log("newMsg", newMsg);
        if (newMsg.sender === activeChatId) {
          setMessages((prev) => [...prev, newMsg]);
        }
      });
    }
  }, [activeChatId]);

  // Set the user's typing status
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("userTyping", (userId) => {
      console.log(userId, activeChatId);

      if (userId === activeChatId) {
        setUserTyping(activeChatUsername + " is typing...");
      }
    });

    socket.current.on("userStoppedTyping", () => {
      setUserTyping(undefined);
    });

    return () => {
      if (!socket.current) return;
      socket.current.off("userTyping");
      socket.current.off("userStoppedTyping");
    };
  }, [activeChatId]);

  const handleTyping = () => {
    if (!socket.current) return;

    // Clear the previous timer if it exists
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    // Start a new timer
    const newTypingTimer = setTimeout(() => {
      if (!socket.current) return;

      // If this timer expires, the user stopped typing, so emit the "stopTyping" event
      socket.current.emit("stopTyping");
    }, 2000); // 2000 milliseconds = 2 seconds

    // Update the typing timer in the state
    setTypingTimer(newTypingTimer);

    // Emit the "typing" event
    socket.current.emit("typing", userId, activeChatId);
  };

  const handleStopTyping = () => {
    if (!socket.current) return;

    // Clear the timer when the user stops typing
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    socket.current.emit("stopTyping");
  };

  const handleSendMessage = () => {
    if (!socket.current) return;

    if (messageInput.trim() !== "") {
      socket.current.emit("sendNewMsg", {
        userId,
        msgSendToUserId: activeChatId,
        msg: messageInput,
      });

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
          {userTyping && <p className="mb-2">{userTyping} is typing...</p>}

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
