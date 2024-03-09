import React, { useState } from "react";
import Button from "../ui/Button";
import { Dialog } from "@headlessui/react";
import ChatForm from "./ChatForm";
import { LogOut } from "lucide-react";
import { useAuthContext } from "../../context/authSlice";
import Modal from "../ui/Modal";
import UserProfile from "../UserProfile";
import { logOut as storeLogout } from "../../context/authSlice";
import { useDispatch } from "react-redux";

const SideBarHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  const { userData } = useAuthContext();
  const dispatch = useDispatch();

  return (
    <div className="w-full">
      <div className="flex items-center justify-around py-6 bg-slate-600 w-full">
        <div className="profile__image">
          <img
            src={userData?.avatar}
            alt={userData?.username}
            width={50}
            className="rounded-full"
            onClick={() => {
              setIsOpen(true);
              setProfile(true);
            }}
          />
        </div>
        <Button
          className="px-2 py-4 text-xl bg-violet-600"
          onclick={() => {
            setIsOpen(true);
            setProfile(false);
          }}
        >
          Add chat{" "}
        </Button>
        <Button
          className="px-2 py-4 text-xl bg-violet-600 rounded-full"
          onclick={() => {
            dispatch(storeLogout());
            localStorage.clear();
          }}
        >
          <LogOut />
        </Button>
      </div>

      <Modal isOpen={isOpen} closeModal={closeModal}>
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-xl font-medium leading-6 text-gray-900 justify-center"
          >
            {!profile ? "Create Chat" : "Your Profile"}
          </Dialog.Title>
          {/* here chat form will be placed */}
          {!profile && <ChatForm setIsOpen={setIsOpen} />}
          {profile && <UserProfile user={userData} />}
        </Dialog.Panel>
      </Modal>
    </div>
  );
};

export default SideBarHeader;
