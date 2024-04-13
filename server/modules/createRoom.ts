import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const createRoom = (io: Server, socket: Socket, roomName:string, userName:string, activeRooms: Map<string, Room>, socketIDToUserNameMapper: Map<string,string>) => {
    socket.join(roomName);
    activeRooms.set(roomName,{ name: roomName, users: new Set([userName])});
    socketIDToUserNameMapper.set(socket.id, userName);
    socket.emit("roomCreated", roomName);
    const roomArray: string[] = Array.from(activeRooms.keys());
    io.emit("activeRooms", roomArray);
}

export default createRoom;