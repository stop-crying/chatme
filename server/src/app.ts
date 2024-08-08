import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import config from "config";
import logger from "./utils/logger";
import { version } from "../package.json";
import socket from "./socket";

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();

const httpsServer = createServer(app);

const io = new Server(httpsServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get("/", (_, res) => {
  res.send({ message: `Server is up and running version ${version}` });
});

httpsServer.listen(port, host, () => {
  logger.info("🚀 Server is listening 🚀 ");
  logger.info(`http://${host}:${port}`);
  socket({io})
  
}); 
