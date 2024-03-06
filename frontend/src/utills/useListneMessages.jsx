import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useChatContext } from "../context/chatSlice";
import { useAuthContext } from "../context/authSlice";
import useMessages from "../context/zustand/message";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { userData } = useAuthContext();
  const {selectedChat} = useChatContext();
  const { messages, setMessages } = useMessages();

  useEffect(() => {
    socket?.on("new message recived", (message) => {
      console.log("hello");
      console.log(message);
      if (message.chat == selectedChat._id) {
        setMessages([...messages, message]);
      }
    });
    
    return () => {
      socket?.off("new message recived");
    };
  }, [socket, messages, setMessages, selectedChat]);
};

export default useListenMessages;
