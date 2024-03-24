import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/SocketService';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {


  constructor(private socket: SocketService) {}

  ngOnInit(): void {

    this.receiveJoinedPlayers();
   
  }


  createRoom(room: string) {
    this.socket.createRoom(room);  
  }

  receiveJoinedPlayers() {
    this.socket.receiveJoinedPlayers().subscribe((message) => {
      alert(message);
    })
  }

}
