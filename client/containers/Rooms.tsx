import { useRef } from "react";

import { useSocket } from "../contexts/socketcontext";
import EVENTS from "../config/events";

export default function Rooms() {
  const { Socket, roomID, rooms } = useSocket();

  const newRoomName = useRef<HTMLInputElement>(null);

  function handleRoomCreation() {
    const roomName = newRoomName.current?.value;
    if (!String(roomName).trim()) {
      return;
    }

    Socket.emit(EVENTS.CLIENT.CREATE_ROOM, roomName);

    newRoomName.current!.value = "";
  }

  function joinRoom(key: string) {
    if (key === roomID) {
      return;
    }

    Socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  }

  return (
    <div className="w-full p-5 flex items-center justify-center flex-col">
      <div className=" flex w-full flex-col items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Room Name"
          ref={newRoomName}
          className=" w-[60%] placeholder:text-12px text-[12px] font-bold px-5 text-black h-[40px] rounded-lg outline-none ring-1 ring-black"
        />
        <button
          onClick={handleRoomCreation}
          className="w-[40%] text-[14px] bg-black ring-1 ring-white rounded-lg p-5"
        >
          Create Room
        </button>
      </div>

      {Object.keys(rooms).map((key) => {
        return (
          <div key={key}>
            <button
              className="text-black p-4  "
              disabled={key === roomID}
              title={`join ${key}`}
              onClick={() => joinRoom(key)}
            >
              {`Room Id :${key}`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
