import { useEffect, useState } from "react";
import { getAllChats } from "../../api/api";
import { requestHandler } from "../../utills";
import SideBarHeader from "./SideBarHeader";
import { useDispatch } from "react-redux";
import { setChats } from "../../context/chatSlice";
import toast from "react-hot-toast";
import AllChats from "./AllChats";

const SideBar = () => {
  return (
    <div>
      <div className="flex justify-center items-center flex-col ">
        <SideBarHeader />
        <AllChats />
      </div>
    </div>
  );
};

export default SideBar;
