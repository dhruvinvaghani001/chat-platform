import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  status: localStorage?.getItem("user") ? true : false,
  userData: JSON.parse(localStorage?.getItem("user")),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logOut: (state, action) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("user");
    },
  },
});

export default authSlice;
export const { login, logOut } = authSlice.actions;

export const useAuthContext = () => {
  const userData = useSelector((state) => state.auth.userData);
  const status = useSelector((state) => state.auth.status);
  return { userData, status };
};
