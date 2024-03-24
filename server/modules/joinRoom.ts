import { Socket, Server } from "socket.io";

const joinRoom = (io: Server, socket: Socket, roomName:string, activeRooms: Map<String, Set<String>>) => {
    if (activeRooms.has(roomName) && activeRooms.get(roomName)!.size < 2) {
        socket.join(roomName);
        activeRooms.get(roomName)!.add(socket.id);
        console.log(`User ${socket.id} joined room: ${roomName}`);
        io.to(roomName).emit("userJoined", `${socket.id} has joined your room`);
      } else {
        socket.emit("roomError", "Room does not exist or is full!");
    }
}

export default joinRoom;