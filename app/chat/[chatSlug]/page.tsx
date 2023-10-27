import type { Metadata } from "next";
import MessageBar from "@/components/common/ChatComponents/MessagesBar";
import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import { tokenCheckClient } from "@/utils/authorizationCheck";

export const metadata: Metadata = {
  title: "Chat",
  description: "Talk about any topic with your friend",
};

interface PageProps {
  params: { activeChatId: string };
}

export default async function Page({ params }: PageProps) {
  tokenCheckClient();
  return (
    <main className="max-w-full flex items-start px-1 ms:px-5 ">
      <div className="hidden md:block ">
        <ChatBar />
      </div>
      <MessageBar />
    </main>
  );
}
