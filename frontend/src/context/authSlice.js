import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      state.status = true;
      state.userData = action.payload.user;
      localStorage.setItem("user", user);
    },
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.user;
      localStorage.setItem("user", user);
    },
    logOut: (state, action) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("user");
    },
  },
});

export default authSlice;
export const { login, logout, register } = authSlice.actions;
