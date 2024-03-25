import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const disconnect = (io:Server, socket: Socket, activeRooms: Map<string, Room>, socketIDToUserNameMapper: Map<string,string>) => {
  const user: string = socketIDToUserNameMapper.get(socket.id) ||  '';
  if(user === '') return;
  console.log(`User ${user} left`);
    activeRooms.forEach((room, roomName) => {
        if (room.users.has(user)) {
          room.users.delete(user);
          io.to(roomName).emit("userLeft", `${user} left the room`);
        }
        if (room.users.size === 0) {
          activeRooms.delete(roomName);
          console.log(`Room ${roomName} removed`);
        }
    });
}


export default disconnect;