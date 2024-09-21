import { IChat } from "@/types/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  activeChatUsername?: string;
  chats: IChat[];
}

interface MessageStore {
  messageEdit?: string;
}

export const useChatStore = create(
  persist<ChatState>(
    (set, get) => ({
      activeChatUsername: undefined,
      chats: [],
    }),
    {
      name: "chat-storage", // name of the item in the storage (must be unique)
    },
  ),
);

export const useMessageStore = create<MessageStore>()((set) => ({
  messageEdit: undefined,
}));
