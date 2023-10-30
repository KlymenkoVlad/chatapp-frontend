"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChatStore, useMessageStore } from "@/src/store";
import io from "socket.io-client";
import { baseUrl } from "@/utils/baseUrl";
import { Socket } from "socket.io-client";
import Message from "./Message";
import { IMessage, IUser } from "@/types/interfaces";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MdArrowBack, MdCancel, MdSend } from "react-icons/md";
import Cookies from "js-cookie";
import Image from "next/image";
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
  const token = Cookies.get("token");

  const { chatSlug: activeChatId } = useParams();
  const router = useRouter();

  const activeChatUsername = useChatStore((state) => state.activeChatUsername);
  const userId = useChatStore((state) => state.userId);
  const messageEdit = useMessageStore((state) => state.messageEdit);

  const socket = useRef<Socket | null>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/user/${activeChatId}`,
          { headers: { Authorization: token } }
        );
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

  // Update messages if message is deleted
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("msgDeletedReceived", async ({ userMessageIndex }) => {
      console.log("Message deleted");
      setMessages((prev) =>
        prev.filter((_, index) => index !== userMessageIndex)
      );
    });
  }, [activeChatId]);

  // Update messages if message is edited
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on(
      "msgEditedReceived",
      async ({ userMessageIndex, msgId, newMsgText }) => {
        console.log(newMsgText);
        setMessages((prev) => {
          const updatedMessages = prev.map((message, index) => {
            console.log(message);
            if (index === userMessageIndex) {
              return {
                ...message,
                msg: newMsgText, // Update the msg property with newMsgText
              };
            }
            return message;
          });
          return updatedMessages;
        });
        setMessageInput("");
        useMessageStore.setState({
          messageEdit: undefined,
        });
      }
    );
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
        setUserTyping(activeChatUsername);
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

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!socket.current) return;

    if (messageEdit) {
      if (!socket.current) {
        socket.current = io(baseUrl);
      }

      const message = messages.find((msg) => msg._id === messageEdit);

      if (!message) throw new Error("No message to edit");

      socket.current.emit("editMsg", {
        userId: message.sender,
        msgSendToUserId: message.receiver,
        msgId: message._id,
        newMsgText: messageInput,
      });
      console.log("edit message");
      return;
    }

    if (messageInput.trim() !== "") {
      socket.current.emit("sendNewMsg", {
        userId,
        msgSendToUserId: activeChatId,
        msg: messageInput,
      });

      setMessageInput("");
    }
  };

  const MessageNav = () => {
    return (
      <div className="p-3 flex items-center justify-between font-bold">
        <div className="flex">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mr-2 ms:mr-5 h-[40px] w-[40px] inline-flex justify-center items-center md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 "
          >
            <MdArrowBack className="text-2xl" />
          </button>

          {receiverUser ? (
            <div className="flex items-center">
              {receiverUser.mainPicture ? (
                <Image
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full mr-1 ms:mr-5"
                  src={receiverUser.mainPicture}
                  alt="user photo"
                />
              ) : (
                <Image
                  width={40}
                  height={40}
                  src="/blank-profile-icon.webp"
                  className="w-10 h-10 rounded-full mr-1 ms:mr-5"
                  alt="user photo"
                />
              )}

              <p className=" font-bold">{receiverUser.name}</p>
            </div>
          ) : (
            <div className="flex items-center">
              <Image
                src="/blank-profile-icon.webp"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-1 ms:mr-5 animate-pulse"
                alt="user photo"
              />

              <div className="animate-pulse h-2 w-14 bg-slate-300 rounded "></div>
            </div>
          )}
        </div>

        {messageEdit && (
          <>
            <button
              onClick={() => {
                useMessageStore.setState({ messageEdit: undefined });
                setMessageInput("");
              }}
              className=" text-center hidden ms:flex"
            >
              Cancel editing message
              <MdCancel className="text-2xl ml-2 fill-red-600" />
            </button>
            <button
              onClick={() => {
                useMessageStore.setState({ messageEdit: undefined });
                setMessageInput("");
              }}
              className=" text-center flex ms:hidden"
            >
              Cancel editing
              <MdCancel className="text-2xl ml-2 fill-red-600" />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`md:ml-4 w-full min-h-[70vh] mx-auto bg-white shadow-md rounded-md relative `}
    >
      <MessageNav />
      <div className="w-full h-[1px] bg-gray-200 mb-4"></div>
      <div
        className="overflow-y-auto h-[70vh] mb-24 px-4"
        ref={messagesContainerRef}
      >
        <div className="space-y-2">
          {messages &&
            messages.length > 0 &&
            messages.map((message, index) => (
              <Message
                key={index}
                userId={userId}
                message={message}
                setMessageInput={setMessageInput}
              />
            ))}
        </div>
      </div>

      <div className="absolute w-full bottom-4 left-0 mx-2 will-change-auto bg-white ">
        {userTyping && (
          <p className="font-semibold">{userTyping} is typing...</p>
        )}

        <form onSubmit={(e) => handleSendMessage(e)}>
          <label htmlFor="chat" className="sr-only">
            Your message
          </label>
          <div className="flex items-center px-3 py-2 rounded-lg">
            <textarea
              id="chat"
              rows={2}
              value={messageInput}
              onInput={handleTyping}
              onBlur={handleStopTyping}
              onChange={(e) => setMessageInput(e.target.value)}
              className={`max-h-16 block mx-2 p-2.5 w-full text-sm bg-white text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Your message..."
            ></textarea>
            <button
              type="submit"
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
            >
              <MdSend className="text-2xl" />
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageBar;
