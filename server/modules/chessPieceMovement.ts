import { Socket, Server } from "socket.io";
import { Room } from "../interfaces/room";

const chessPieceMovement = (io: Server, socket: Socket, chess_board: Array<Array<string>>, activeRooms: Map<string, Room>, socketIDToUserNameMapper: Map<string, string>) => {
    io.emit("Emitted Chess Piece", chess_board)
}

export default chessPieceMovement;