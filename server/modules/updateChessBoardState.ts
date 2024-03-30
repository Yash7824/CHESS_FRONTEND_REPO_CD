import { Socket, Server } from "socket.io";

const updateChessBoardState = (io: Server, socket: Socket, roomName:string, updatedChessBoardMatrix: Array<Array<string>>, socketIDToUserNameMapper: Map<string,string>) => {
    if(roomName) {
        console.log("Update Chess Board");
        socket.to(roomName).emit("getUpdatedChessBoardState", { updatedChessBoardMatrix });
    }
}


export default updateChessBoardState;