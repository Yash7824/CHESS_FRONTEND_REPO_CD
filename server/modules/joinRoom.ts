import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const joinRoom = (io: Server, socket: Socket, roomName:string, userName:string, activeRooms: Map<String,Room>, socketIDToUserNameMapper: Map<string,string>) => {
    if (activeRooms.has(roomName) && activeRooms.get(roomName)!.users.size < 2) {
        socket.join(roomName);
        activeRooms.get(roomName)!.users.add(userName);
        socketIDToUserNameMapper.set(socket.id, userName);
        console.log(`${userName} with socket ID: ${socket.id} has joined the room: ${roomName}`)
        socket.to(roomName).emit("userJoined", `${userName} has joined your room 😊`);
        const users = Array.from(activeRooms.get(roomName)!.users);
        console.log(users);
        io.to(roomName).emit('player1', users[0]);
        io.to(roomName).emit('player2', userName);
      } else {
        socket.emit("roomError", "Room does not exist or is full!");
    }
}

export default joinRoom;