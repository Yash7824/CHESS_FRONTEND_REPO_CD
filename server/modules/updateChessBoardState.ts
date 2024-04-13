import { Socket, Server } from "socket.io";

const updateChessBoardState = (io: Server, socket: Socket, roomName:string, updatedChessBoardMatrix: Array<Array<string>>, updatedChessBoardAttributes:any, socketIDToUserNameMapper: Map<string,string>) => {
    if(roomName) {
        socket.to(roomName).emit("getUpdatedChessBoardState", { updatedChessBoardMatrix, updatedChessBoardAttributes });
    }
}


export default updateChessBoardState;