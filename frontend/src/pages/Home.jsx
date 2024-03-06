import React, { useEffect, useState, Fragment } from "react";
import { searchAvailableUser } from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut as storeLogout } from "../context/authSlice";
import { Dialog, Transition } from "@headlessui/react";
import { requestHandler } from "../utills";
import SideBar from "../components/sidebar/SideBar";
import Main from "../components/main/Main";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    requestHandler(
      async () => await searchAvailableUser(),
      setLoading,
      (res) => {
        const { data } = res;
        setUsers(data || []);
      },
      (err) => {
        toast.error(err);
      }
    );
  }, []);

  return (
    <>
      <div className="w-full h-[100vh]">
        <div className="flex w-full h-[100vh]">
          <div className="w-1/4 overflow-y-scroll">
            <SideBar />
          </div>
          <div className="w-3/4 overflow-y-scroll">
            <Main />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
