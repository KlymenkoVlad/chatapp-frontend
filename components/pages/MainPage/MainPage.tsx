import MessagesBar from "@/components/common/ChatComponents/MessagesBar";
import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import React from "react";

const MainPage = () => {
  return (
    <div className="flex max-w-full items-start ">
      <ChatBar />
      <MessagesBar />
    </div>
  );
};

export default MainPage;
