import Chat from "@/components/common/ChatComponents/MessagesBar";
import MessagesBar from "@/components/common/ChatBarComponents/ChatBar";
import MainPage from "@/components/pages/MainPage/MainPage";
import { tokenCheck } from "@/utils/authorizationCheck";

export default function Home() {
  tokenCheck();
  return (
    <main className="max-w-full px-16 py-5">
      <MainPage />
    </main>
  );
}
