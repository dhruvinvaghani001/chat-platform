import React, { useState } from "react";
import { useAuthContext } from "../../context/authSlice";
import {
  removeUnnreadMessages,
  setSelectedChat,
  useChatContext,
} from "../../context/chatSlice";
import { useDispatch } from "react-redux";
import { MoreVertical } from "lucide-react";
import RightSideBarPanel from "../chatInfoModal/RightSideBarPanel";
import Modal from "react-responsive-modal";
import { Bell } from "lucide-react";

const Chat = ({ chat }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { userData } = useAuthContext();
  const { selectedChat, unreadMessages } = useChatContext();

  const toggleIsOpen = () => {
    setOpen(!open);
  };

  const notificationCount = unreadMessages.filter(
    (message) => message.chat.toString() == chat._id.toString()
  ).length;

  const oneToOneChatMemeber = chat.members.filter(
    (item) => item.username != userData.username
  )[0];

  // console.log("check");
  // console.log(chat?.lastMessage?.sender._id.toString());
  // console.log(userData._id.toString())
  // console.log(chat?.lastMessage?.sender._id.toString() == userData._id.toString());

  return (
    <div>
      <div
        className={`flex justify-between  mb-3 p-4 rounded-md items-center  duration-150
        ${
          selectedChat?._id == chat._id
            ? "bg-gray-500"
            : "bg-gray-700 hover:bg-gray-600"
        }   
        ${notificationCount > 0 ? "chat" : ""}
        `}
        onClick={() => {
          dispatch(setSelectedChat({ chat: chat }));
          dispatch(removeUnnreadMessages({ chatId: chat._id.toString() }));
        }}
      >
        <div className="flex items-center">
          <div className="profile__img mr-4">
            <img
              src={chat.isGroup ? "vite.svg" : oneToOneChatMemeber.avatar}
              alt={chat.isGroup ? chat.name : oneToOneChatMemeber.username}
              height={50}
              width={50}
              className="rounded-full"
            />
          </div>
          <div>
            {chat.isGroup ? chat?.name : oneToOneChatMemeber.username}
            {chat?.lastMessage && (
              <div>
                {chat?.lastMessage?.sender._id.toString() ==
                userData._id.toString()
                  ? "You : "
                  : chat.lastMessage?.sender?.username + ": "}
                {chat.lastMessage.content}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {notificationCount > 0 ? (
            <div className="flex h-[30px] w-[30px] bg-green-700 items-center justify-center rounded-full">
              {notificationCount}
            </div>
          ) : (
            <></>
          )}
          <MoreVertical onClick={() => setOpen(true)} />
        </div>
      </div>
      <RightSideBarPanel open={open} toggleIsOpen={toggleIsOpen} chat={chat} />
    </div>
  );
};

export default Chat;
