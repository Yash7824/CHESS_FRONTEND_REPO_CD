import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { connect } from 'socket.io-client';
import { Room } from 'src/app/models/Room';
import { RoomData } from 'src/app/models/RoomData';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent {

  
  constructor(private router: Router, public socket: SocketService) {}

  ngOnInit(): void {
  }

  joinroom : RoomData = { userName: '', roomName: ''}
  
  joinRoom(userName: string, roomName: string) {
    this.socket.joinRoom(userName, roomName);
    this.navigateTo("game", { playerName: userName, roomName: roomName });
    // if(this.socket.activeRoomArray.includes(roomName)){
    //   this.socket.joinRoom(userName, roomName);
    //   this.navigateTo("game", { playerName: userName, roomName: roomName });
    // }else{
    //   alert('Invalid room');
    // } 
  }
  

  navigateTo(route: string, params: Object) {
    this.router.navigate([`/${route}`],{ queryParams: params});
  }  

}
