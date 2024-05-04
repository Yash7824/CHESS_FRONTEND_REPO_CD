import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const createRoom = (io: Server, socket: Socket, roomName:string, userName:string, activeRooms: Map<string, Room>, socketIDToUserNameMapper: Map<string,string>) => {
    socket.join(roomName);
    activeRooms.set(roomName,{ name: roomName, users: new Set([userName])});
    socketIDToUserNameMapper.set(socket.id, userName);
    console.log(`${userName} with socket ID: ${socket.id} has joined the room: ${roomName}`)
    socket.emit("roomCreated", roomName);
    const roomArray: string[] = Array.from(activeRooms.keys());
    io.emit("activeRooms", roomArray);
    io.to(roomName).emit("player1", userName);
}

export default createRoom;