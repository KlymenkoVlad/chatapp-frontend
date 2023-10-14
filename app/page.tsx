import { tokenCheck } from "@/utils/authorizationCheck";
import ChatBar from "@/components/common/ChatBarComponents/ChatBar";
import MessagesBar from "@/components/common/ChatComponents/MessagesBar";

export default function Home() {
  tokenCheck();
  return (
    <main className="max-w-full flex items-start px-16 py-5">
      <ChatBar />
      <MessagesBar />
    </main>
  );
}
