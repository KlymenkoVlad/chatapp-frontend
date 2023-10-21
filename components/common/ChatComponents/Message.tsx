import { IMessage } from "@/types/interfaces";
import dateFormat from "@/utils/dateFormat";
import React from "react";

const Message = ({
  date,
  _id,
  msg,
  receiver,
  sender,
  userId,
}: IMessage & { userId?: string }) => {
  return (
    <div
      className={`flex max-w-full mt-2 space-x-3  ${
        sender === userId && "ml-auto justify-end"
      } `}
      key={_id}
    >
      <div>
        <div
          className={` p-3 rounded-r-lg rounded-bl-lg ${
            sender === userId ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          <p className="text-sm break-all">{msg}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {dateFormat(date)}
        </span>
      </div>
    </div>
  );
};

export default Message;
