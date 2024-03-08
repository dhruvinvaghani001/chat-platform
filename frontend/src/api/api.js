import axios from "axios";

/*create a axios instance with server base URL*/
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 120000,
});

/*
 * add interceptor to all outgoing request
 * to add Authorizatoin header in all requests ,
 */
axiosInstance.interceptors.request.use(
  function (config) {
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    config.headers.Authorization = `Bearer ${user?.acessToken}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    error.message = error?.response?.data?.message;
    return Promise.reject(error);
  }
);

/**
 * @param {*} data {username,email,password,confirmPassword} serverUrl (server url for authenctiocaton of user )
 * @returns a <Promise> of api call
 */
const autheticateUser = ({ serverURL, data }) => {
  return axiosInstance.post(`/user/${serverURL}`, data);
};

/**
 *
 * @returns logout a user
 */
const logout = () => {
  return axiosInstance.post("/user/logout");
};

/**
 *
 * @returns available users on platform to chat
 */
const searchAvailableUser = () => {
  return axiosInstance.get("/chat/available-user");
};

/**
   * Creates a one-to-one chat with the specified user.
   * @param {ObjectId} userId - The ID of the user to create the chat with.
     @returns {Promise} - A promise that resolves to the response of the API call.
*/
const createOneToOneChat = (userId) => {
  return axiosInstance.post(`/chat/c/${userId}`);
};

/**
 * get all chats in which user is part of it ;
 * @returns a promise that resolve to the response of the api call
 */

const getAllChats = () => {
  return axiosInstance.get("/chat");
};

/**
 * Create group chat
 * @params : data ({name , members})
 * @returns a promise that resolve the response of api call
 */
const createGroup = (data) => {
  return axiosInstance.post("/chat/group", data);
};

/**
 * Handles api call for get all messages for particular chat id
 @params : chatId
 @returns a promise that resolve the response of api call
 */
const getMessagesByChatId = (chatId) => {
  return axiosInstance.get(`/message/${chatId}`);
};

/**
 * Handles api call for send message in chat ;
 * @param {data,chatId} {data:string of message content} chatID : in which chat you want to send message
 */
const sendMessageInChat = ({ data, chatId }) => {
  return axiosInstance.post(`/message/${chatId}`, data);
};

/**
 * Handles api call for delete one to one chat !
 * @param {string} chatId
 * @returns
 */
const deleteChats = ({ type, chatId }) => {
  return axiosInstance.delete(
    `chat/${type == false ? "c" : "group"}/${chatId}`
  );
};



export {
  autheticateUser,
  logout,
  searchAvailableUser,
  createOneToOneChat,
  getAllChats,
  createGroup,
  getMessagesByChatId,
  sendMessageInChat,
  deleteChats,
};
