"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/src/store";
import io from "socket.io-client";
import { baseUrl } from "@/utils/baseUrl";
import { Socket } from "socket.io-client";
import Message from "./Message";
import { IMessage, IUser } from "@/types/interfaces";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

const MessageBar = () => {
  const [receiverUser, setReceiverUser] = useState<undefined | IUser>(
    undefined
  );
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [messageInput, setMessageInput] = useState("");
  const [userTyping, setUserTyping] = useState<undefined | string>(undefined);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  );
  const { chatSlug: activeChatId } = useParams();
  const router = useRouter();

  // const activeChatId = useChatStore((state) => state.activeChatId);
  const activeChatUsername = useChatStore((state) => state.activeChatUsername);
  const userId = useChatStore((state) => state.userId);

  const socket = useRef<Socket | null>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/user/${activeChatId}`);
        setReceiverUser(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, []);

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
      className={`md:ml-4 w-full min-h-[70vh] mx-auto bg-white shadow-md rounded-md relative`}
    >
      <div className="p-4">
        <div className="p-3 flex items-center font-bold">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mr-5 h-[40px] w-[40px] inline-flex md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center  items-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4 rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>

          {receiverUser ? (
            <div className="flex items-center">
              <img
                src={receiverUser.mainPicture}
                alt={receiverUser.username}
                className="w-10 h-10 rounded-full mr-5"
              />

              <p className=" font-bold">{receiverUser.name}</p>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-400 rounded-full mr-5"></div>

              <p>Loading...</p>
            </div>
          )}
        </div>
        <div className="w-full h-[1px] bg-gray-200 mb-4"></div>
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
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
