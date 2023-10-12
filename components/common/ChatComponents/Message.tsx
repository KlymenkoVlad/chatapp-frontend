import dateFormat from "@/utils/dateFormat";
import React from "react";

interface Message {
  date: string;
  _id: string;
  msg: string;
  receiver: string;
  sender: string;
  userId: string | null;
}

const Message = ({ date, _id, msg, receiver, sender, userId }: Message) => {
  return (
    <div
      className={`flex w-full mt-2 space-x-3 max-w-xs ${
        sender === userId && "ml-auto justify-end"
      } `}
      key={_id} // Add a unique key for each message
    >
      {sender !== userId && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      )}
      <div>
        <div
          className={` p-3 rounded-r-lg rounded-bl-lg ${
            sender === userId ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          <p className="text-sm">{msg}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {dateFormat(date)}
        </span>
      </div>
      {sender === userId && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      )}
    </div>
  );
};

export default Message;
