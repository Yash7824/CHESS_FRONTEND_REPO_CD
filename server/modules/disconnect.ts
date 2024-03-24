import { Socket, Server } from "socket.io";

const disconnect = (io:Server, socket: Socket, activeRooms: Map<string, Set<string>>) => {
    console.log(`User ${socket.id} left`);
    activeRooms.forEach((users, roomName) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          io.to(roomName).emit("userLeft", `${socket.id} left the room`);
        }
        if (users.size === 0) {
          activeRooms.delete(roomName);
          console.log(`Room ${roomName} removed`);
        }
    });
}


export default disconnect;