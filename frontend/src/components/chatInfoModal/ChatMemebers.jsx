import React from "react";
import { useAuthContext } from "../../context/authSlice";
import { Trash2 } from "lucide-react";

const ChatMemebers = ({ chat }) => {
  const { userData } = useAuthContext();

  return (
    <>
      <div className="memebers mt-10">
        <h1 className="text-xl mb-2">Members</h1>
        {chat.members.map((member) => {
          return (
            <div className="mb-6 flex items-center justify-between bg-gray-700 p-2 rounded-md">
              <div className="flex items-center">
                <div className="profile__img">
                  <img
                    src={member.avatar}
                    alt={member.username}
                    width={50}
                    className="rounded-full mr-4"
                  />
                </div>
                <div>
                  {member.username}
                  {member._id == userData._id ? "(You)" : ""}
                </div>
              </div>
              <div className="flex  items-center justify-end">
                <div>
                  {chat?.admin == member._id ? (
                    <p className="mr-4 p-2 bg-green-700 rounded-md">Admin</p>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {(chat?.admin == userData._id && chat.isGroup ) ? (
                    <button className="bg-red-700 p-2 rounded-md text-white">
                      <Trash2 />
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChatMemebers;
