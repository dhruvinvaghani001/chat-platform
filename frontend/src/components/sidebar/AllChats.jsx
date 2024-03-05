import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllChats } from "../../api/api";
import toast from "react-hot-toast";
import { requestHandler } from "../../utills";
import { setChats } from "../../context/chatSlice";
import { useSelector } from "react-redux";
import Chat from "./Chat";

const AllChats = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    requestHandler(
      async () => await getAllChats(),
      setLoading,
      (res) => {
        const { data } = res;
        console.log(data);
        dispatch(setChats({ chat: data }));
      },
      (err) => {
        toast.error(err);
      }
    );
  }, []);

  const chats = useSelector((state) => state.chat.chats);
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="mt-8 w-full p-4">
      {chats.map((chat,index) => <Chat chat={chat}  key={index}/>)}
    </div>
  );
};

export default AllChats;
