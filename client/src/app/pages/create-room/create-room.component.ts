import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/SocketService';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  constructor(private router: Router, private socket: SocketService) {}

  ngOnInit(): void {}

  createRoom(roomName: string, userName: string) {
    this.socket.createRoom(roomName, userName);
    this.navigateTo('game', { roomName: roomName, playerName: userName });
  }

  navigateTo(route: string, params:Object) {
    this.router.navigate([`/${route}`,], { queryParams: params});
  }
}
