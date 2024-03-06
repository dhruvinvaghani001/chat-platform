import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./authSlice";

const socketContext = createContext({ socket: null });

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const { userData } = useAuthContext();

  useEffect(() => {
    if (userData) {
      const socketInstance = io("http://localhost:5000");
      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socketInstance.close();
        setSocket(null);
      }
    }
  }, [userData]);

  useEffect(() => {
    socket?.emit("setup", { userId: userData._id });
  }, [socket]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

const useSocketContext = () => useContext(socketContext);

export { SocketContextProvider, useSocketContext };
