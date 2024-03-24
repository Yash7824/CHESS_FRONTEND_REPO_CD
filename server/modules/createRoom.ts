import { Socket } from "socket.io";

const createRoom = (socket: Socket, roomName:string, activeRooms: Map<String, Set<String>>) => {
    socket.join(roomName);
    activeRooms.set(roomName, new Set([socket.id]));
    console.log(`User ${socket.id} created and joined room: ${roomName}`);
    socket.emit("roomCreated", roomName);
}

export default createRoom;