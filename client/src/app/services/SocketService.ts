import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(roomName: string, userName: string) {
    this.socket.emit('join room', roomName, userName);
  }

  createRoom(roomName: string, userName: string) {
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
}
