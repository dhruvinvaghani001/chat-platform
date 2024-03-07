import React, { useState } from "react";
import { useAuthContext } from "../../context/authSlice";
import { setSelectedChat, useChatContext } from "../../context/chatSlice";
import { useDispatch } from "react-redux";
import { MoreVertical } from "lucide-react";
import RightSideBarPanel from "../chatInfoModal/RightSideBarPanel";
import Modal from "react-responsive-modal";
import { X } from "lucide-react";

const Chat = ({ chat }) => {
  const { userData } = useAuthContext();
  const dispatch = useDispatch();

  const { selectedChat } = useChatContext();

  const [open, setOpen] = useState(false);

  const toggleIsOpen = () => {
    setOpen(!open);
  };

  if (!chat.isGroup) {
    const oneToOneChatMemeber = chat.members.filter(
      (item) => item.username != userData.username
    )[0];
    return (
      <div>
        <div
          className={`flex justify-between  mb-3 p-4 rounded-md items-center  duration-150 
        ${
          selectedChat?._id == chat._id
            ? "bg-gray-500"
            : "bg-gray-700 hover:bg-gray-600"
        }
        `}
          onClick={() => dispatch(setSelectedChat({ chat: chat }))}
        >
          <div className="flex items-center">
            <div className="profile__img mr-4">
              <img
                src={oneToOneChatMemeber.avatar}
                alt={oneToOneChatMemeber.username}
                height={50}
                width={50}
                className="rounded-full"
              />
            </div>
            <div>
              {oneToOneChatMemeber.username}
              {chat?.lastMessage && (
                <div>
                  {chat?.lastMessage?.sender._id == userData._id
                    ? "You : "
                    : chat.lastMessage?.sender?.username + ": "}
                  {chat.lastMessage.content}
                </div>
              )}
            </div>
          </div>
          <div>
            <MoreVertical onClick={() => setOpen(true)} />
          </div>
        </div>
        <RightSideBarPanel
          open={open}
          toggleIsOpen={toggleIsOpen}
          chat={chat}
        />
      </div>
    );
  } else {
    return (
      <div>
        <div
          className={`flex justify-between mb-3 p-4 rounded-md items-center  duration-150
        ${
          selectedChat?._id == chat._id
            ? "bg-gray-500"
            : "bg-gray-700 hover:bg-gray-600"
        }
        
        `}
          onClick={() => dispatch(setSelectedChat({ chat: chat }))}
        >
          <div className="flex items-center">
            <div className="profile__img mr-4">
              <img
                src="public/vite.svg"
                alt={chat.name}
                height={50}
                width={50}
                className="rounded-full"
              />
            </div>
            <div>
              {chat.name}
              {chat?.lastMessage && (
                <div>
                  {chat?.lastMessage?.sender?._id == userData?._id
                    ? "You : "
                    : chat.lastMessage?.sender?.username + ": "}
                  {chat.lastMessage.content}
                </div>
              )}
            </div>
          </div>
          <div>
            <MoreVertical onClick={() => setOpen(true)} />
          </div>
        </div>
        <RightSideBarPanel
          open={open}
          toggleIsOpen={toggleIsOpen}
          chat={chat}
        />
      </div>
    );
  }
};

export default Chat;
