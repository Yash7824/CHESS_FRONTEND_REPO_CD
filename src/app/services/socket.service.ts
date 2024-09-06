import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  activeRoomArray: string[] = []

  constructor() {
    // this.socket = io('http://localhost:3000');
    this.socket = io(`${environment.socket_url}`);
  }

  receiveEventOutput(event: string){
    return new Observable((observer) => {
      this.socket.on(event, (message) => {
        observer.next(message);
      })
    })
  }

  makeMove(fromRow: number, fromCol: number, toRow: number, toCol: number){
    this.socket.emit('makeMove', fromRow, fromCol, toRow, toCol)
  }

  joinRoom(userName: string, roomName: string) {
    this.socket.emit('join room', roomName, userName);
  }

  createRoom(roomName: string, userName: string) {
    this.socket.emit('create room', roomName, userName);
    this.socket.emit('Active Rooms');
  }

  disconnect() {
    this.socket.emit('disconnect');
  }

  restartGame(){
    this.socket.emit('restartGame')
  }

  saveGame(authtoken: string){
    this.socket.emit('saveGame', authtoken);
  }
  
}
