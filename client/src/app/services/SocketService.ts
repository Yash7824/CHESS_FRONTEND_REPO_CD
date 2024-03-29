import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  chess_Board: string[][] = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(userName: string, roomName: string) {
    this.socket.emit('join room', roomName, userName);
  }

  createRoom(userName: string, roomName: string) {
    this.socket.emit('create room', roomName, userName);
  }

  receiveJoinedPlayers() {
    return new Observable((observer) => {
      this.socket.on('userJoined', (message) => {
        observer.next(message);
      });
    });
  }

  disconnect() {
    this.socket.emit('disconnect');
  }

  chessPieceEmit(chess_board: Array<Array<string>>){
    this.socket.emit('ChessPieceMove', chess_board);
  }

  chessPieceListen(){
    return new Observable((subscriber) => {
      this.socket.on('Emitted Chess Piece', (data) => {
        subscriber.next(data);
      })
    })
  }
}
