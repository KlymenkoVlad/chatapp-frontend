import type { Metadata } from "next";
import MessageBar from "@/components/common/MessageBarComponents/MessagesBar";
import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import { tokenCheckClient } from "@/utils/authorizationCheck";
import Search from "@/components/common/LayoutComponents/clientHeader/Search";

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
    <main className="max-w-full flex items-start ">
      <div className="hidden md:block ml-3">
        <div className="mb-10 flex items-end mx-auto p-2">
          <Search smallSearch={true} />
        </div>
        <ChatBar />
      </div>
      <MessageBar />
    </main>
  );
}
