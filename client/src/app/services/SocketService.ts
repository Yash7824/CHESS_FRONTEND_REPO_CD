import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';


@Injectable({
    providedIn: 'root'
})


export class SocketService {

    socket!: Socket;


    constructor() {
        this.socket = io("http://localhost:3000");
    }

    joinRoom(roomName:string) {
        this.socket.emit("join room", roomName);
    }
    
    createRoom(roomName: string) {
        this.socket.emit("create room", roomName);
    } 

    receiveJoinedPlayers() {
        return new Observable((observer) => {
            this.socket.on("userJoined", (message) => {
                observer.next(message);
            })
        })
    }
    
}