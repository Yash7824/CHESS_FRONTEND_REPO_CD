import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const updateMovementList = (io: Server, socket: Socket, updatedMovementList: any, roomName: string, activeRooms: Map<string, Room>, socketIDToUserNameMapper: Map<string,string>) => {
    io.to(roomName).emit('updatedMovement', updatedMovementList);
}

export default updateMovementList;