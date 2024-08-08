import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import { nanoid } from "nanoid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_MESSAGE: "SEND_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    ROOM_MESSAGE: "ROOM_MESSAGE",
    JOINED_ROOM: "JOINED_ROOM",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info("Sockets Enabled");

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User Connected ${socket.id}`);

    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomname }) => {
      console.log(roomname);
      const roomId = nanoid();

      rooms[roomId] = {
        name: roomname,
      };

      socket.join(roomId);

      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    socket.on(EVENTS.CLIENT.SEND_MESSAGE, (data: { roomID: string; message: string; username: string }) => {
      const { roomID, message, username } = data;
      const timestamp = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
      console.log(`Received message in room ${roomID}: ${message} from ${username}`);
    
      socket.to(roomID).emit(EVENTS.SERVER.ROOM_MESSAGE, {
        message,
        username,
        time: timestamp,
      });
    
      console.log(`Emitted message to room ${roomID}`);
    });

    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomid) => {
      socket.join(roomid);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomid);
    });
  });
}

export default socket;
