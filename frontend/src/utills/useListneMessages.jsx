import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { addChat, updateChat, useChatContext } from "../context/chatSlice";
import { useAuthContext } from "../context/authSlice";
import useMessages from "../context/zustand/message";
import { useDispatch } from "react-redux";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { userData } = useAuthContext();
  const { selectedChat } = useChatContext();
  const { messages, setMessages } = useMessages();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("new message", (message) => {
      console.log("hello");
      console.log(message);
      if (message.chat == selectedChat._id) {
        setMessages([...messages, message]);
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
      console.log("event getting for chat-update");
      console.log(chat);
      dispatch(updateChat({ chat: chat }));
    });

    return () => {
      socket?.off("chat-update");
    };
  }, [socket]);
};

export default useListenMessages;
