import React from "react";
import { useChatContext } from "../../context/chatSlice";
import { useAuthContext } from "../../context/authSlice";

const MainHeader = () => {
  const { selectedChat } = useChatContext();
  const { userData } = useAuthContext();

  const chat = selectedChat;
  const oneToOneChatMemeber = chat?.members?.filter(
    (item) => item.username != userData?.username
  )[0];

  return (
    <div>
      <header className="fixed bg-slate-600 top-0 w-full py-7 shadow-md z-10 flex">
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
    </div>
  );
};

export default MainHeader;
