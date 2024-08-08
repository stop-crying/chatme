"use client";

import { useSocket } from "../../contexts/socketcontext";
import Rooms from "../../containers/Rooms";
import Messages from "../../containers/Messages";
import { useRef } from "react";

export default function Home() {
  const { Socket, username, setUsername } = useSocket();
  const usernameRef = useRef<HTMLInputElement>(null);

  function handleSetUser() {
    const value = usernameRef.current?.value;
    if (!value) {
      return;
    }
    console.log(value);

    setUsername(value);

    localStorage.setItem("username", value);
  }
  return (
    <div
      className="w-full bg-gradient-to-tr from-red-200 to-blue-200 flex items-center justify-center flex-col"
      style={{ height: "100vh" }}
    >
      {!username && (
        <div className=" flex w-full flex-col items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Username"
            ref={usernameRef}
            className=" w-[60%] placeholder:text-12px text-[12px] font-bold px-5 text-black h-[40px] rounded-lg outline-none ring-1 ring-black"
          />
          <button
            onClick={handleSetUser}
            className="w-[40%] text-[14px] bg-black ring-1 ring-white rounded-lg p-5"
          >
            start
          </button>
        </div>
      )}

      {username && (
        <div
          className="w-full bg-gradient-to-tr from-red-200 to-blue-200 flex-col flex items-center justify-start gap-4"
          style={{ height: "100vh" }}
        >
          <Rooms />
          <Messages />
        </div>
      )}
    </div>
  );
}
