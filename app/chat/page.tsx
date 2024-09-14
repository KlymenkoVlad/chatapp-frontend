import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import Header from "@/components/common/LayoutComponents/Header";
import { tokenCheckClient } from "@/utils/authorizationCheck";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Chats",
  description: "Talk about any topic with your friend",
};

export default function page() {
  tokenCheckClient();
  return (
    <>
      <Header />
      <main className="items-start px-3 md:flex">
        <ChatBar />
        <div className="mx-6 hidden h-[calc(100vh_-_100px)] w-full items-center justify-center rounded-md bg-gray-200 p-8 text-center text-3xl font-semibold md:flex">
          <h1>Choose chat from chat bar or find you friend above</h1>
        </div>
      </main>
    </>
  );
}
