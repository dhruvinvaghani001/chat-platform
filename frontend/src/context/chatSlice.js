import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  chats: [],
  selectedChat: null,
  unreadMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload.chat;
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
    setUnreadMessages: (state, action) => {
      console.log(action.payload.message);
      const newmessage = action.payload.message;
      state.unreadMessages = [...state.unreadMessages, newmessage];
    },
    removeUnnreadMessages: (state, action) => {
      const chatId = action.payload.chatId;
      const filteredMessages = state.unreadMessages.filter(
        (message) => message.chat.toString() != chatId
      );
      state.unreadMessages = filteredMessages;
    },
  },
});

export default chatSlice;
export const {
  setSelectedChat,
  setChats,
  addChat,
  updateChat,
  deleteChat,
  setUnreadMessages,
  removeUnnreadMessages
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
