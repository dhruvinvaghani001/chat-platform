import React, { useEffect } from "react";
import { searchAvailableUser } from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut as storeLogout } from "../context/authSlice";


const Home = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const res = await searchAvailableUser();
        console.log(res);
      } catch (error) {
        console.log("Error:" + error);
        console.log(error)
        if (error.response.status === 401) {
          toast.error("session expires !");
          dispatch(storeLogout());
          navigate("/login");
        }
      }
    };
    fetchDatas();
  }, []);

  return (
    <>
      <div>Home</div>
      <button onClick={() => {}}>login</button>
    </>
  );
};

export default Home;
