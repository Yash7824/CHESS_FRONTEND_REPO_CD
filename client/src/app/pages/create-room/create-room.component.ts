import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/SocketService';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  constructor(private socket: SocketService, private router: Router) {}

  ngOnInit(): void {}

  createRoom(roomName: string, userName: string) {
    this.socket.createRoom(roomName, userName);
    this.navigateTo("game");
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

}
