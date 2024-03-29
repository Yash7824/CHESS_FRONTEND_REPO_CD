import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const updateChessBoardState = (io: Server, socket: Socket, roomName:string, userName:string, chessBoardStateMatrix: Array<Array<string>>, socketIDToUserNameMapper: Map<string,string>) => {
    socket.to(roomName).emit("getUpdatedChessBoardState", { chessBoardStateMatrix });
}

export default updateChessBoardState;