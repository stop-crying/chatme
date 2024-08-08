import { json } from "stream/consumers";
import { useSocket } from "../contexts/socketcontext";
import { useRef } from "react";
import EVENTS from "../config/events";

export default function Messages() {
  const { Socket, messages, username, roomID, setMessages } = useSocket();
  const handleRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    const message = handleRef.current?.value;
    if (!String(message).trim()) {
      return;
    }

    console.log("Emitting event with data:", {
      roomID,
      message,
      username,
    });

    Socket.emit(EVENTS.CLIENT.SEND_MESSAGE, {
      roomID,
      message,
      username,
    });
    const date = new Date();
    setMessages([
      ...messages,
      {
        username: "You",
        message,
        time: `${date.getHours()}: ${date.getMinutes()}`,
      },
    ]);
  }

  if (!roomID) {
    return <div>no room id yet!!</div>;
  }

  return (
    <div
      className="w-full h-full flex-1 p-5 flex flex-col items-center justify-between gap-5"
      style={{ flex: " 1 1 0%", justifyContent: "space-between", gap: "20px" }}
    >
      <div
        className="flex-1 w-full flex flex-col items-center justify-center "
        style={{
          justifyContent: "start",
          gap: "15px",
          // flex: " 1 1 0%",
          overflowY: "auto",
          padding: "20px",
          height: "30rem",
        }}
        id="screen"
      >
        {messages.map((message, key) => {
          return (
            <span
              className="w-full p-5 ring-1 rounded-lg ring-black shadow-lg"
              key={key}
              style={{ width: "100%", position: "relative" , boxShadow : "0px 4px 8px rgba(0,0,0,0.2"}}
            >
              <p className="text-black text-14px p-6 ">{`${message.message} `}</p>
              <p
                style={{
                  position: "absolute",
                  fontSize: "10px",
                  fontStyle: "italic",
                  color: "black",
                  bottom: "2px",
                  right: "10px",
                }}
              >{`From ${message.username} at ${message.time}`}</p>
            </span>
          );
        })}
      </div>

      <div
        className="w-full flex items-center justify-between gap-6"
        style={{ gap: "10px" }}
      >
        <input
          className=" w-full outline-none h-[50px] p-5 ring-1 ring-black rounded-xl text-black placeholder:text-black"
          style={{
            width: "70%",
            height: "40px",
            borderRadius: "20px",
            padding: "15px",
          }}
          placeholder="send a message"
          ref={handleRef}
        />
        <button
          className="w-[40%] ml-4 flex-1 h-[40px] text-white bg-black text-center"
          style={{ width: "30%", height: "40px", borderRadius: "20px" }}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
