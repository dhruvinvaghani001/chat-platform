import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../context/chatSlice";
import { requestHandler } from "../../utills";
import { getMessagesByChatId, sendMessageInChat } from "../../api/api";
import toast from "react-hot-toast";
import Input from "../Input";
import Button from "../Button";
import moment from "moment";
import { useAuthContext } from "../../context/authSlice";
import { useSocketContext } from "../../context/SocketContext";
import useMessages from "../../context/zustand/message";
import useListenMessages from "../../utills/useListneMessages";

const Main = () => {
  const { selectedChat } = useChatContext();
  const [loading, setLoading] = useState();
  const [inputMessage, setInputMessage] = useState("");
  const lastmessageIndex = useRef(null);
  const { userData } = useAuthContext();
  const { socket } = useSocketContext();

  const { messages, setMessages } = useMessages();


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

  useEffect(() => {
    lastmessageIndex.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    requestHandler(
      async () =>
        await sendMessageInChat({
          data: { content: inputMessage },
          chatId: selectedChat._id,
        }),
      setLoading,
      (res) => {
        const { data } = res;
        console.log(data);
        setMessages([...messages, data]);
        setInputMessage("");
        socket.emit("new-message", {message:data,chat:selectedChat});
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  useListenMessages();

  return (
    <div className="container mx-auto relative ">
      <header className="fixed bg-slate-600 top-0 w-full py-10 shadow-md z-10">
        <nav>To : jenil</nav>
      </header>

      <div className="messages__container mt-40 pb-16 ">
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
          <div
            className={`flex ${
              msg.sender?._id == userData._id ? "justify-end" : "justify-start"
            } items-start mb-4`}
            ref={lastmessageIndex}
            key={index}
          >
            <img
              src={msg.sender?.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div className="bg-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-800">{msg.content}</p>
              <span className="text-xs text-gray-600">
                {moment(msg.createdAt).format("MMMM Do YY, h:mm a")}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-full shadow-md z-10">
        {selectedChat && (
          <div className="w-full">
            <form onSubmit={sendMessage}>
              <Input
                type="text"
                className="p-4 w-[68%] mb-2 rounded-md mr-2 focus:outline-none"
                placeholder="Send a message"
                onchange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
              />
              <Button className="p-4 bg-slate-700">Send</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
