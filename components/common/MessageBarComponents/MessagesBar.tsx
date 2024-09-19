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
    undefined,
  );
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [messageInput, setMessageInput] = useState("");
  const [userTyping, setUserTyping] = useState<undefined | string>(undefined);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );

  const [dropDownActive, setDropDownActive] = useState(false);

  const token = Cookies.get("token");

  const { chatSlug: activeChatId } = useParams();
  const router = useRouter();

  const activeChatUsername = useChatStore((state) => state.activeChatUsername);
  const userId = useChatStore((state) => state.userId);
  const messageEdit = useMessageStore((state) => state.messageEdit);
  const dropDownRef = useRef<any>(null);

  console.log(userId);
  const socket = useRef<Socket | null>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/user/${activeChatId}`,
          { headers: { Authorization: token } },
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
        prev.filter((_, index) => index !== userMessageIndex),
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
      },
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

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropDownActive(false);
        console.log("dafsd");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="relative flex items-center justify-between p-3 font-bold">
        <div className="flex">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-2 inline-flex h-[40px] w-[40px] items-center justify-center rounded-full bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 ms:mr-5"
          >
            <MdArrowBack className="text-2xl" />
          </button>

          {receiverUser ? (
            <div className="flex items-center">
              {receiverUser.mainPicture ? (
                <Image
                  width={40}
                  height={40}
                  onClick={() => setDropDownActive(!dropDownActive)}
                  className="mr-1 h-12 w-12 cursor-pointer rounded-full ms:mr-5"
                  src={receiverUser.mainPicture}
                  alt="user photo"
                />
              ) : (
                <Image
                  width={40}
                  height={40}
                  onClick={() => setDropDownActive(!dropDownActive)}
                  src="/blank-profile-icon.webp"
                  className="mr-1 h-12 w-12 cursor-pointer rounded-full ms:mr-5"
                  alt="user photo"
                />
              )}

              <div
                ref={dropDownRef}
                id="dropdownAvatar"
                className={`top-16 z-10 w-fit max-w-[400px] font-normal ${
                  dropDownActive ? "opacity-100" : "opacity-0"
                } transition-opacity delay-150 duration-1000 ease-in-out ${
                  dropDownActive ? "absolute" : "hidden"
                } w-44 divide-y divide-gray-100 rounded-lg bg-white shadow`}
              >
                <div className="flex flex-col px-4 py-3 text-sm text-gray-900">
                  {receiverUser.name && (
                    <p>
                      <span className="font-bold">Name:</span>{" "}
                      {receiverUser?.name}
                    </p>
                  )}
                  {receiverUser.lastname && (
                    <p>
                      <span className="font-bold">Lastname:</span>{" "}
                      {receiverUser?.lastname}
                    </p>
                  )}
                  <p>
                    <span className="font-bold">Email:</span>{" "}
                    <a
                      className="text-blue-500 transition-colors hover:text-blue-700"
                      href={`mailto:${receiverUser?.email}`}
                    >
                      {receiverUser?.email}
                    </a>
                  </p>
                  <p>
                    <span className="font-bold">Username:</span>{" "}
                    {receiverUser?.username}
                  </p>
                </div>
              </div>

              <div className="h-full">
                <p className="font-bold">{receiverUser.name}</p>
                {userTyping && (
                  <p className="font-semibold text-blue-700">
                    is typing <span className="animate-ping">.</span>
                    <span
                      style={{ animationDelay: "0.3s" }}
                      className="animate-ping"
                    >
                      .
                    </span>
                    <span
                      style={{ animationDelay: "0.6s" }}
                      className="animate-ping"
                    >
                      .
                    </span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Image
                src="/blank-profile-icon.webp"
                width={40}
                height={40}
                className="mr-1 h-12 w-12 animate-pulse rounded-full ms:mr-5"
                alt="user photo"
              />

              <div className="h-2 w-14 animate-pulse rounded bg-slate-300"></div>
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
              className="hidden text-center ms:flex"
            >
              Cancel editing message
              <MdCancel className="ml-2 fill-red-600 text-2xl" />
            </button>
            <button
              onClick={() => {
                useMessageStore.setState({ messageEdit: undefined });
                setMessageInput("");
              }}
              className="flex text-center ms:hidden"
            >
              Cancel editing
              <MdCancel className="ml-2 fill-red-600 text-2xl" />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col md:ml-4">
      <MessageNav />
      <div className="flex-grow overflow-hidden border">
        <div
          className="h-[30vh] overflow-y-auto p-2 small:h-[38vh] mid:h-[58vh] tall:h-[68vh] large:h-[74vh] exralarge:h-[80vh]"
          ref={messagesContainerRef}
        >
          {messages &&
            messages.length > 0 &&
            messages.map((message, index) => (
              <div className="mx-2 cursor-pointer">
                <Message
                  key={index}
                  userId={userId}
                  message={message}
                  setMessageInput={setMessageInput}
                />
              </div>
            ))}
        </div>
        <div className="h-[70vh] border-t bg-white p-2 small:h-[60vh] mid:h-[42vh] tall:h-[30vh] large:h-[20vh]">
          <form onSubmit={(e) => handleSendMessage(e)} className="h-full">
            <label htmlFor="chat" className="sr-only">
              Your message
            </label>
            <div className="flex items-center rounded-lg px-3 py-2">
              <textarea
                id="chat"
                rows={2}
                value={messageInput}
                onInput={handleTyping}
                onBlur={handleStopTyping}
                onChange={(e) => setMessageInput(e.target.value)}
                className={`focus:shadow-outline mx-2 block h-24 max-h-24 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none`}
                placeholder="Your message..."
              ></textarea>
              <button
                type="submit"
                className="inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100"
              >
                <MdSend className="text-2xl" />
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;
