import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../context/chatSlice";
import { requestHandler } from "../../utills";
import { getMessagesByChatId } from "../../api/api";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/authSlice";
import { useSocketContext } from "../../context/SocketContext";
import useMessages from "../../context/zustand/message";
import useListenMessages from "../../utills/useListneMessages";

import MessageInput from "./MessageInput";
import MainHeader from "./MainHeader";
import MessageContainer from "./MessageContainer";

const Main = () => {
  const { selectedChat } = useChatContext();
  const [loading, setLoading] = useState();
  const { setMessages } = useMessages();

  useEffect(() => {
    if (selectedChat) {
      requestHandler(
        async () => await getMessagesByChatId(selectedChat?._id),
        setLoading,
        (res) => {
          const { data } = res;
          setMessages(data);
        },
        (err) => {
          toast.error(err);
        }
      );
    }
  }, [selectedChat]);

  useListenMessages();

  return (
    <div className="container mx-auto relative ">
      {selectedChat && <MainHeader />}
      <MessageContainer loading={loading} />
      {selectedChat && (
        <div className="fixed bottom-0 w-full shadow-md z-10">
          <MessageInput />
        </div>
      )}
    </div>
  );
};

export default Main;
