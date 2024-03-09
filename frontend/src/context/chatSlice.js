import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  chats: [],
  selectedChat: JSON.parse(localStorage?.getItem("selected-chat")) || null,
  unreadMessages: JSON.parse(localStorage?.getItem("unread-messages")) || [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload.chat;
      localStorage.setItem(
        "selected-chat",
        JSON.stringify(action.payload.chat)
      );
    },
    setChats: (state, action) => {
      state.chats = action.payload.chat;
    },
    addChat: (state, action) => {
      const chats = [action.payload.chat, ...state.chats];
      state.chats = [...new Set([...chats])];
    },
    updateChat: (state, action) => {
      const updatedChat = action.payload.chat;
      const remainingChat = state.chats.filter(
        (chat) => chat._id != updatedChat._id
      );
      state.chats = [updatedChat, ...remainingChat];
    },
    deleteChat: (state, action) => {
      const chatTodelete = action.payload.chat;
      const filterdChat = state.chats.filter(
        (chat) => chat._id != chatTodelete._id
      );
      state.chats = filterdChat;
    },
    setintialUnreadMessages: (state, action) => {
      const map = new Map();
      const newUnreadWhole = [
        ...state.unreadMessages,
        ...action.payload.messages,
      ];
      newUnreadWhole.forEach((obj) => {
        map.set(obj._id.toString(), obj);
      });

      const uniqueObjectArray = [...map.values()];

      state.unreadMessages = uniqueObjectArray;
      localStorage.setItem(
        "unread-messages",
        JSON.stringify(state.unreadMessages)
      );
    },
    setUnreadMessages: (state, action) => {
      const map = new Map();
      const newUnreadWhole = [...state.unreadMessages, action.payload.message];
      console.log(newUnreadWhole);
      newUnreadWhole.forEach((obj) => {
        map.set(obj._id.toString(), obj);
      });
      const uniqueObjectArray = [...map.values()];
      state.unreadMessages = uniqueObjectArray;
      localStorage.setItem(
        "unread-messages",
        JSON.stringify(state.unreadMessages)
      );
    },
    removeUnnreadMessages: (state, action) => {
      const chatId = action.payload.chatId;
      const filteredMessages = state.unreadMessages.filter(
        (message) => message.chat.toString() != chatId
      );
      state.unreadMessages = filteredMessages;
      localStorage.setItem(
        "unread-messages",
        JSON.stringify(state.unreadMessages)
      );
    },
  },
});

export default chatSlice;
export const {
  setSelectedChat,
  setChats,
  addChat,
  updateChat,
  setintialUnreadMessages,
  deleteChat,
  setUnreadMessages,
  removeUnnreadMessages,
} = chatSlice.actions;

/**
 * function to return all state directly using CustomHook
 *
 */
export const useChatContext = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);
  const unreadMessages = useSelector((state) => state.chat.unreadMessages);
  return { selectedChat, chats, unreadMessages };
};
