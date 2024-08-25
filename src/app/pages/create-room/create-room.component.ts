import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoomData } from 'src/app/models/RoomData';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  constructor(private router: Router, private socket: SocketService) {}

  ngOnInit(): void {}

  createroom: RoomData = { userName: '', roomName: ''}
  createRoom(roomName: string, userName: string) {
    console.log("create");
    this.socket.createRoom(roomName, userName);
    this.navigateTo('game', { playerName: userName, roomName: roomName });
  }

  navigateTo(route: string, params:Object) {
    this.router.navigate([`/${route}`,], { queryParams: params});
  }
}
