import React from "react";
import moment from "moment";
import { useAuthContext } from "../../context/authSlice";
import { useChatContext } from "../../context/chatSlice";

const Message = ({ msg, lastmessageIndex }) => {
  const { userData } = useAuthContext();
  const { selectedChat } = useChatContext();

  return (
    <div
      className={`flex ${
        msg.sender?._id == userData._id ? "justify-end" : "justify-start"
      } items-start mb-4`}
      ref={lastmessageIndex}
    >
      <img
        src={msg.sender?.avatar}
        alt={msg.sender.username}
        className="w-10 h-10 rounded-full mr-2"
      />
      <div className="bg-gray-200 rounded-lg p-3">
        {selectedChat.isGroup && (
          <p className="text-sm text-gray-900">{msg.sender.username}</p>
        )}
        <div class="grid grid-cols-2 gap-2">
          {msg?.attachmentFiles?.map((file, index) => (
            <img
              src={file.url}
              key={index}
              alt="Image 1"
              width="200"
              height="200"
              class="aspect-image object-cover rounded-lg"
            />
          ))}
        </div>
        <p className="mt-2 text-gray-800 text-md">{msg.content}</p>
        <span className="text-xs text-gray-600">
          {moment(msg.createdAt).format("MMMM Do YY, h:mm a")}
        </span>
      </div>
    </div>
  );
};

export default Message;
