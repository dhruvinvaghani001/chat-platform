import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../context/chatSlice";
import { requestHandler } from "../../utills";
import { getMessagesByChatId, sendMessageInChat } from "../../api/api";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuthContext } from "../../context/authSlice";
import { useSocketContext } from "../../context/SocketContext";
import useMessages from "../../context/zustand/message";
import useListenMessages from "../../utills/useListneMessages";
import Message from "./Message";
import Chat from "../sidebar/Chat";

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
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  useListenMessages();

  const chat = selectedChat;
  const oneToOneChatMemeber = chat?.members?.filter(
    (item) => item.username != userData?.username
  )[0];

  return (
    <div className="container mx-auto relative ">
      {selectedChat && (
        <header className="fixed bg-slate-600 top-0 w-full py-7 shadow-md z-10 flex">
          {/* <nav>To : jenil</nav> */}
          {/* <Chat chat={selectedChat} /> */}

          <div className="profile__img mr-4 flex items-center ">
            <img
              src={chat?.isGroup ? "vite.svg" : oneToOneChatMemeber?.avatar}
              alt={chat?.isGroup ? chat?.name : oneToOneChatMemeber?.username}
              height={50}
              width={50}
              className="rounded-full"
            />
            <div>
              {chat?.isGroup ? chat?.name : oneToOneChatMemeber?.username}
            </div>
          </div>
        </header>
      )}

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
          <Message msg={msg} key={index} lastmessageIndex={lastmessageIndex} />
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
