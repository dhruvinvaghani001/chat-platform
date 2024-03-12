import React, { useState } from "react";
import { useAuthContext } from "../../context/authSlice";
import { Trash2, UserPlus } from "lucide-react";
import Button from "../ui/Button";
import ChatMemebers from "./ChatMemebers";
import MultipleSelectComboBox from "../sidebar/MultipleSelectComboBox";
import ComboBox from "../sidebar/ComboBox";
import { requestHandler } from "../../utills";
import { addMemberInGroup, deleteChats, leaveGroup } from "../../api/api";
import toast from "react-hot-toast";
import { setSelectedChat } from "../../context/chatSlice";
import { useDispatch } from "react-redux";

const RightSideBarPanel = ({ toggleIsOpen, open, chat }) => {
  const { userData } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const alredyInGroup = chat.members.map((user) => user._id.toString());
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // handles to delete chat on forntend siude which calls required api ;
  const handleDeleteChat = () => {
    const isProceed = confirm("are you sure wan to delete chat with ");
    if (isProceed) {
      requestHandler(
        async () => await deleteChats({ type: chat.isGroup, chatId: chat._id }),
        setLoading,
        (res) => {
          const { data } = res;
          console.log(res);
          toast.success(res.message);
          dispatch(setSelectedChat({ chat: null }));
          toggleIsOpen();
        },
        (err) => {
          toast.error(err);
        }
      );
    }
  };

  //function to leave group chat:
  const handleLeaveGroup = () => {
    const isProceed = confirm("Are you sure want to leave group");
    if (isProceed) {
      requestHandler(
        async () => await leaveGroup(chat._id),
        setLoading,
        (res) => {
          const { data } = res;
          console.log(data);
          toast.success(res.message);

          toggleIsOpen();
        },
        (err) => {
          toast.error(err);
        }
      );
    }
  };

  //function to add memeber in group!
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!member) {
      toast.error("please select memeber to add in group!");
    }
    requestHandler(
      async () =>
        await addMemberInGroup({ chatId: chat._id, memberId: member._id }),
      setLoading,
      (res) => {
        const { data } = res;
        toast.success(res.message);
        setIsFormOpen(false);
        setMember(null);
      },
      (err) => {
        toast.error(err);
      }
    );
  };

  return (
    <div className="">
      {open && (
        <div className="fixed inset-0 right-0 bg-gray-800 bg-opacity-75 z-50">
          <div className="absolute right-0 w-1/4 h-full bg-gray-900 p-4 transition-all duration-300">
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleIsOpen}
            >
              Close Panel
            </button>
            <h1 className="text-2xl flex justify-center mt-2">{chat.name}</h1>
            <ChatMemebers chat={chat} />

            {isFormOpen && (
              <div className="mb-4 p-4  bg-slate-500 rounded-md">
                <h1 className="text-2xl flex justify-center mb-4">
                  Add Member
                </h1>
                <div className="">
                  <form
                    onSubmit={handleAddMember}
                    className="flex flex-col gap-2"
                  >
                    <ComboBox
                      selected={member}
                      setSelected={setMember}
                      alredyMembers={alredyInGroup}
                    />

                    <Button className="bg-red-700 p-2" type="submit">
                      Add
                    </Button>
                  </form>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {chat.isGroup && chat.admin == userData._id && (
                <div>
                  <Button
                    className="flex items-center text-xl bg-violet-700 py-2 justify-center w-full"
                    onclick={() => setIsFormOpen(!isFormOpen)}
                  >
                    Add Participants <UserPlus width={40} className="mr-4" />
                  </Button>
                </div>
              )}
              {chat.isGroup && (
                <div>
                  <Button
                    className="flex items-center text-xl bg-red-600 py-2 justify-center w-full"
                    onclick={handleLeaveGroup}
                  >
                    Leave Group <Trash2 width={40} className="mr-4" />
                  </Button>
                </div>
              )}
              {((chat.isGroup && chat.admin == userData._id) ||
                !chat.isGroup) && (
                <div>
                  <Button
                    onclick={handleDeleteChat}
                    className="flex items-center text-xl bg-red-600 py-2 justify-center w-full"
                  >
                    Delete Chat <Trash2 width={40} className="mr-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSideBarPanel;
