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
    <main className="flex max-w-full items-start">
      <div className="ml-3 hidden md:block">
        <div className="mx-auto mb-10 flex items-end p-2">
          <Search smallSearch={true} />
        </div>
        <ChatBar />
      </div>
      <MessageBar />
    </main>
  );
}
