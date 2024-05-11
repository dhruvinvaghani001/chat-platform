import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import {
  addChat,
  deleteChat,
  removeUnnreadMessages,
  setSelectedChat,
  setUnreadMessages,
  updateChat,
  useChatContext,
} from "../context/chatSlice";
import { useAuthContext } from "../context/authSlice";
import useMessages from "../context/zustand/message";
import { useDispatch } from "react-redux";

const useListenEvents = () => {
  const { socket } = useSocketContext();
  const { userData } = useAuthContext();
  const { selectedChat } = useChatContext();
  const { messages, setMessages } = useMessages();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("new message", (message) => {
      if (message.chat == selectedChat?._id) {
        setMessages([...messages, message]);
      } else {
        console.log("event for unreadmesage");
        dispatch(setUnreadMessages({ message: message }));
      }
    });

    return () => {
      socket?.off("new message");
    };
  }, [socket, messages, setMessages, selectedChat]);

  useEffect(() => {
    socket?.on("new chat", (payload) => {
      dispatch(addChat({ chat: payload }));
    });
    return () => {
      socket?.off("new chat");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("chat-update", (chat) => {
      console.log("updated chat");
      console.log(chat);
      dispatch(updateChat({ chat: chat }));
    });

    return () => {
      socket?.off("chat-update");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("delete-chat", (chat) => {
      dispatch(deleteChat({ chat: chat }));
      dispatch(removeUnnreadMessages({ chatId: chat._id.toString() }));
      dispatch(setSelectedChat({ chat: null }));
      setMessages([]);
    });
    return () => {
      socket?.off("delete-chat");
    };
  }, [socket]);
};

export default useListenEvents;
