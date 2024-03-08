import React, { useState } from "react";
import { useAuthContext } from "../../context/authSlice";
import { Trash2 } from "lucide-react";
import { requestHandler } from "../../utills";
import toast from "react-hot-toast";
import { removeMemberFromGroup } from "../../api/api";

const ChatMemebers = ({ chat }) => {
  const { userData } = useAuthContext();
  const [loading, setLoading] = useState(false);

  //function to remove memebers from group:
  const handleRemoveMemeber = (memeberId) => {
    const isProceed = confirm("are you sure want to remove this memeber ?");
    if (isProceed) {
      requestHandler(
        async () =>
          await removeMemberFromGroup({
            chatId: chat._id,
            memberId: memeberId,
          }),
        setLoading,
        (res) => {
          const { data } = res;
          toast.success(res.message);
        },
        (err) => {
          toast.error(err);
        }
      );
    }
  };

  return (
    <>
      <div className="memebers mt-10">
        <h1 className="text-xl mb-2">Members</h1>
        {chat.members.map((member, index) => {
          return (
            <div
              className="mb-6 flex items-center justify-between bg-gray-700 p-2 rounded-md"
              key={index}
            >
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
                  {chat?.admin == userData._id &&
                  chat.isGroup &&
                  userData._id.toString() != member._id.toString() ? (
                    <button
                      className="bg-red-700 p-2 rounded-md text-white"
                      onClick={() => handleRemoveMemeber(member._id)}
                    >
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
