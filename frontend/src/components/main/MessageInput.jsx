import React, { useState } from "react";
import { useAuthContext } from "../../context/authSlice";
import { useChatContext } from "../../context/chatSlice";
import Input from "../ui/Input";
import Button from "../ui/Button";
import useMessages from "../../context/zustand/message";
import { requestHandler } from "../../utills";
import toast from "react-hot-toast";
import { sendMessageInChat } from "../../api/api";

const MessageInput = () => {
  const [inputMessage, setInputMessage] = useState("");
  const { selectedChat } = useChatContext();
  const { messages, setMessages } = useMessages();
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <div className="w-full">
        <form onSubmit={sendMessage}>
          <Input
            type="text"
            className="p-4 w-[68%] mb-2 rounded-md mr-2 focus:outline-none"
            placeholder="Send a message"
            onchange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
          />
          <input type="file" accept="image/*" multiple onChange={()=>{}} />
          <Button className="p-4 bg-slate-700">Send</Button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
