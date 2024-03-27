"use client";

import { useMessageStore } from "@/src/store";
import { IMessage } from "@/types/interfaces";
import { baseUrl } from "@/utils/baseUrl";
import dateFormat from "@/utils/dateFormat";
import React, { useRef } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const Message = ({
  message,
  userId,
  setMessageInput,
}: {
  message: IMessage;
  userId?: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const socket = useRef<Socket | null>();
  const messageEdit = useMessageStore((state) => state.messageEdit);

  const handleMessageDelete = () => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    socket.current.emit("deleteMsg", {
      userId: message.sender,
      msgSendToUserId: message.receiver,
      msgId: message._id,
    });
  };

  const handleMessageEdit = () => {
    console.log("edit");
    useMessageStore.setState({
      messageEdit: message._id,
    });
    setMessageInput(message.msg);
  };

  return (
    <div
      className={`relative flex max-w-[400px] mt-2 space-x-3 ${
        message.sender === userId && "ml-auto justify-end"
      } group`}
      key={message._id}
    >
      <div>
        <div
          className={`p-3  ${
            message.sender === userId
              ? messageEdit === message._id
                ? "bg-blue-900 text-white rounded-l-lg rounded-br-lg"
                : "bg-blue-600 text-white rounded-l-lg rounded-br-lg"
              : "bg-gray-300 rounded-r-lg rounded-bl-lg"
          }`}
        >
          <p className="text-sm break-all">{message.msg}</p>
        </div>
        <span
          className={`text-xs text-gray-500 leading-none  duration-500 ${
            message.sender === userId &&
            "transition-opacity ease-in-out opacity-100 group-hover:opacity-0"
          }  `}
        >
          {dateFormat(message.date)}
        </span>
      </div>
      {message.sender === userId && (
        <div className="flex absolute -bottom-1 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
          <MdModeEditOutline
            className="text-2xl hover:fill-gray-600 transition-colors duration-300 ease-in-out"
            onClick={() => handleMessageEdit()}
          />
          <MdDelete
            className="text-2xl hover:fill-gray-600 transition-colors duration-300 ease-in-out"
            onClick={() => handleMessageDelete()}
          />
        </div>
      )}
    </div>
  );
};

export default Message;
