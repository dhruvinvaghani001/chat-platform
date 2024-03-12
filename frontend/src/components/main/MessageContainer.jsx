import React, { useEffect, useRef } from "react";
import { useChatContext } from "../../context/chatSlice";
import Message from "./Message";
import useMessages from "../../context/zustand/message";
import LoadingSpinner from "../ui/LoadingSpinner";

const MessageContainer = ({ loading }) => {
  const { selectedChat } = useChatContext();
  const { messages } = useMessages();
  const lastmessageIndex = useRef(null);

  useEffect(() => {
    lastmessageIndex.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="messages__container mt-40 pb-16 mb-40">
        {!selectedChat && (
          <h1 className="flex justify-center text-2xl">
            Please select chat to start Conversation!
          </h1>
        )}
        {selectedChat && messages.length === 0 ? (
          <h1 className="flex justify-center items-center text-2xl">
            Start Chatting Now!
          </h1>
        ) : (
          <></>
        )}

        {messages.map((msg, index) => (
          <Message msg={msg} key={index} lastmessageIndex={lastmessageIndex} />
        ))}
      </div>
    </>
  );
};

export default MessageContainer;
