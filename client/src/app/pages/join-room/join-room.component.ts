import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/SocketService';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent {

  
  constructor(private socket: SocketService, private router: Router) {}

  ngOnInit(): void {
   
  }


  joinRoom(roomName: string, userName:string) {
    this.socket.joinRoom(roomName, userName);
    this.navigateTo("game");  
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  

}
