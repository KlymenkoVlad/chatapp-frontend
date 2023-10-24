import { tokenCheckClient } from "@/utils/authorizationCheck";
import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import MessagesBar from "@/components/common/ChatComponents/MessagesBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Chats",
  description: "Talk about any topic with your friend",
};

export default function Home() {
  tokenCheckClient();
  return (
    <main className="px-4 sm:px-12 py-5 flex items-start">
      <ChatBar />
    </main>
  );
}
