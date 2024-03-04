import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: localStorage?.getItem("user") ? true : false,
  userData: localStorage?.getItem("user"),
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
