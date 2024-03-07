import React, { useState } from "react";
import { useAuthContext } from "../../context/authSlice";
import { Trash2, UserPlus } from "lucide-react";
import Button from "../Button";
import ChatMemebers from "./ChatMemebers";
import MultipleSelectComboBox from "../sidebar/MultipleSelectComboBox";
import ComboBox from "../sidebar/ComboBox";

const RightSideBarPanel = ({ toggleIsOpen, open, chat }) => {
  const { userData } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const alredyInGroup = chat.members.map((user) => user._id.toString());
  const [members, setMembers] = useState({});

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
              <>
                <div className="bg-gray-200 p-4">
                  <ComboBox
                    selected={members}
                    setSelected={setMembers}
                    alredyMembers={alredyInGroup}
                  />

                  <Button className="bg-red-700 p-2">Add</Button>
                </div>
              </>
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
                  <Button className="flex items-center text-xl bg-red-600 py-2 justify-center w-full">
                    Leave Group <Trash2 width={40} className="mr-4" />
                  </Button>
                </div>
              )}
              {chat.isGroup && chat.admin == userData._id && (
                <div>
                  <Button className="flex items-center text-xl bg-red-600 py-2 justify-center w-full">
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
