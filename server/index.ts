import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
const { createServer } = require("http");
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import createRoom from "./modules/createRoom";
import joinRoom from "./modules/joinRoom";
import disconnect from "./modules/disconnect";

dotenv.config();

// Server Init and Config
const app: Express = express();
const server: any = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Express Server");
});

// Maintain a list of active rooms and users in each room
const activeRooms: Map<string, Set<string>> = new Map();

io.on("connection", (socket) => {
  console.log(`User:${socket.id} Connected`);
  socket.on("create room", (roomName: string) => createRoom(socket, roomName, activeRooms));
  socket.on("join room", (roomName: string) => joinRoom(io, socket, roomName, activeRooms));
  socket.on("disconnect", () => disconnect(io, socket, activeRooms));
});

server.listen(port, () => {
  console.log(`Server is Running on Port:${port}`);
});
