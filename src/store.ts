import { string } from "yup";
import { create } from "zustand";

interface ChatState {
  activeChat: null | string;
  userId: null | string;
}

export const useChatStore = create<ChatState>()((set) => ({
  activeChat: null,
  userId: null,
}));
