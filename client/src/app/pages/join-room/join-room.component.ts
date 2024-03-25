import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/SocketService';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent {

  
  constructor(private socket: SocketService) {}

  ngOnInit(): void {
   
  }


  joinRoom(room: string) {
    this.socket.joinRoom(room);  
  }
  

}
