import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChatMessage {
  messagesWith: string;
  user: {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  lastMessage?: string;
  date: string;
}

interface ChatState {
  activeChat: null | string;
  chats: ChatMessage[];
}

export const useChatStore = create(
  persist<ChatState>(
    (set, get) => ({
      activeChat: null,
      chats: [],
    }),
    {
      name: "chat-storage", // name of the item in the storage (must be unique)
    }
  )
);
