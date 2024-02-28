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
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * @param {*} data {username,email,password,confirmPassword}
 * @returns a <Promise> of api call
 */
const signUp = (data) => {
  return axiosInstance.post("/user/sign-up", data);
};

/**
 *
 * @param {*} data
 * @returns api call <Promise> of login
 */
const login = (data) => {
  return axiosInstance.post("/user/login", data);
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
  * @returns 
*/









export { signUp , login , logout , searchAvailableUser };
