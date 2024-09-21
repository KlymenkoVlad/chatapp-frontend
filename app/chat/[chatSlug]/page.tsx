import type { Metadata } from "next";
import MessageBar from "@/components/common/MessageBarComponents/MessagesBar";
import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import { authorizedCheck } from "@/utils/authorizationCheck";
import Search from "@/components/common/LayoutComponents/clientHeader/Search";

export const metadata: Metadata = {
  title: "Chat",
  description: "Talk about any topic with your friend",
};

interface PageProps {
  params: { activeChatId: string };
}

export default async function Page({ params }: PageProps) {
  authorizedCheck();
  return (
    <main className="flex max-w-full items-start">
      <div className="ml-3 mt-3 hidden md:block">
        <Search />
        <ChatBar />
      </div>
      <MessageBar />
    </main>
  );
}
