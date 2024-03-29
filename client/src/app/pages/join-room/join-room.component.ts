import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { connect } from 'socket.io-client';
import { SocketService } from 'src/app/services/SocketService';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent {

  
  constructor(private router: Router, private socket: SocketService) {}

  ngOnInit(): void {
   
  }
  

  joinRoom(roomName: string, userName: string) {
    this.socket.joinRoom(roomName, userName);  
    this.navigateTo("game",{ roomName: roomName, playerName: userName});
  }

  navigateTo(route: string, params: Object) {
    this.router.navigate([`/${route}`],{ queryParams: params});
  }  

}
