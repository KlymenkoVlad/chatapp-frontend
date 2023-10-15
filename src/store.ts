import { IChat } from "@/types/interfaces";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatState {
  activeChat?: string;
  userId?: string;
  chats: IChat[];
}

export const useChatStore = create(
  persist<ChatState>(
    (set, get) => ({
      activeChat: undefined,
      userId: undefined,
      chats: [],
    }),
    {
      name: "chat-storage", // name of the item in the storage (must be unique)
    }
  )
);
