import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const joinRoom = (io: Server, socket: Socket, roomName:string, userName:string, activeRooms: Map<String,Room>, socketIDToUserNameMapper: Map<string,string>) => {
    if (activeRooms.has(roomName) && activeRooms.get(roomName)!.users.size < 2) {
        socket.join(roomName);
        activeRooms.get(roomName)!.users.add(userName);
        socketIDToUserNameMapper.set(socket.id, userName);
        console.log(`User ${userName} joined room: ${roomName}`);
        socket.to(roomName).emit("userJoined", `${userName} has joined your room`);
      } else {
        socket.emit("roomError", "Room does not exist or is full!");
    }
}

export default joinRoom;