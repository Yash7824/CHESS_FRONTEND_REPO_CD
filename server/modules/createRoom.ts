import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const createRoom = (io: Server, socket: Socket, roomName:string, userName:string, activeRooms: Map<String, Room>, socketIDToUserNameMapper: Map<string,string>) => {
    socket.join(roomName);
    activeRooms.set(roomName,{ name: roomName, users: new Set([userName])});
    socketIDToUserNameMapper.set(socket.id, userName);
    console.log(`User ${userName} created and joined room: ${roomName}`);
    socket.emit("roomCreated", roomName);
}

export default createRoom;