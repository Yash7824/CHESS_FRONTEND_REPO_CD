import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { connect } from 'socket.io-client';
import { JoinRoom } from 'src/app/models/JoinRoom';
import { SocketService } from 'src/app/services/SocketService';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent {

  
  constructor(private router: Router, public socket: SocketService) {}

  ngOnInit(): void {
   
  }

  joinroom : JoinRoom = { userName: '',roomName: ''}
  
  joinRoom(userName: string, roomName: string) {
    this.socket.joinRoom(userName, roomName);  
    this.navigateTo("game");
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }  

}
