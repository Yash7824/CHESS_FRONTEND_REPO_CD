import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JoinRoom } from 'src/app/models/JoinRoom';
import { SocketService } from 'src/app/services/SocketService';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {

  constructor( private router: Router, private socket: SocketService) {}

  createroom : JoinRoom = { userName: '',roomName: ''}

  createRoom(userName: string, roomName:string) {
    this.socket.createRoom(userName, roomName);  
    // this.navigateTo("game");
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  receiveJoinedPlayers() {
    this.socket.receiveJoinedPlayers().subscribe((message) => {
      console.log(message);
    })
  }

}
