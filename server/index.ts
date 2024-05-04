import express, { Express, Request, Response } from "express";
import cors from "cors";
const { createServer } = require("http");
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import createRoom from "./modules/createRoom";
import joinRoom from "./modules/joinRoom";
import disconnect from "./modules/disconnect";
import updateChessBoardState from "./modules/updateChessBoardState";
import updateMovementList from "./modules/updateMovementList";
import { Room } from "./interfaces/room";
import connectToMongo from "./config/db"

dotenv.config();

// Server Init and Config
const app: Express = express();
connectToMongo();
const server: any = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript + Node.js + Express Server");
});

app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/social', require('./routes/social'))

// Maintain a list of active rooms and users in each room
const activeRooms: Map<string, Room> = new Map();
// Maps each socket id created for user to their username
const socketIDToUserNameMapper: Map<string,string> = new Map();
io.on("connection", (socket) => {
  socket.on("create room", (roomName: string, userName: string) => createRoom(io, socket, roomName, userName, activeRooms, socketIDToUserNameMapper));
  socket.on("join room", (roomName: string, userName: string) => joinRoom(io, socket, roomName, userName, activeRooms, socketIDToUserNameMapper));
  socket.on("updateChessboardState", (roomName: string, updatedChessBoardMatrix: Array<Array<string>>, updatedChessBoardAttributes: any) => updateChessBoardState(io, socket, roomName, updatedChessBoardMatrix, updatedChessBoardAttributes, socketIDToUserNameMapper));
  socket.on("disconnect", () => disconnect(io, socket, activeRooms, socketIDToUserNameMapper));
  socket.on("movementTable", (roomName: string, updatedMovementList: any) => updateMovementList(io, socket, updatedMovementList, roomName, activeRooms, socketIDToUserNameMapper))
});

server.listen(port, () => {
  console.log(`Server is Running on Port:${port}`);
});
