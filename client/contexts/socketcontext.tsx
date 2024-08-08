"use client";

import * as io from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import { createContext, useContext, useState } from "react";
import EVENTS from "../config/events";

interface Context {
  Socket: io.Socket;
  username: string;
  setUsername: Function;
  roomID: string;
  rooms: {};
  messages: { message: string; username: string; time: string }[];
  setMessages: Function;
}

const Socket = io.connect("http://localhost:4000");
Socket.on("connect", () => console.log(Socket.id));

const SocketContext = createContext<Context>({
  Socket,
  setUsername: () => false,
  username: "",
  rooms: {},
  messages: [],
  setMessages: () => false,
  roomID: "",
});

function SocketProvider(props: any) {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const [rooms, setRooms] = useState({});
  const [messages, setMessages] = useState([{}]);

  Socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });
  Socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomID(value);
    setMessages([]); 
  });

  Socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
    setMessages([
      ...messages,
      {
        message,
        username,
        time,
      },
    ]);

    
  });

  return (
    <SocketContext.Provider
      value={{
        Socket,
        username,
        setUsername,
        rooms,
        roomID,
        messages,
        setMessages,
      }}
      {...props}
    />
  );
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
