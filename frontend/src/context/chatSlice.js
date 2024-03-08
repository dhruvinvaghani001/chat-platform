import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  chats: [],
  selectedChat: null,
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
  },
});

export default chatSlice;
export const {
  setSelectedChat,
  setChats,
  addChat,
  updateChat,
  deleteChat
} = chatSlice.actions;

export const useChatContext = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);
  return { selectedChat, chats };
};
