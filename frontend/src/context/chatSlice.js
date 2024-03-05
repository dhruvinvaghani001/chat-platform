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
    addChat : (state,action)=>{
      state.chats = [action.payload.chat,...state.chats];
    },
    
  },
});

export default chatSlice;
export const { setSelectedChat, setChats ,addChat } = chatSlice.actions;

export const useChatContext = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const chats = useSelector((state) => state.chat.chats);
  return { selectedChat, chats };
};
