import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit{

  allFriends: any;
  constructor(public apiServ: ApiService,
     public cs: CommonService,
    public toastr: ToastrService){}

  ngOnInit(){
    if(!this.cs.socialLoaded){
      this.getAllFriends().then((val: any) => {
        this.cs.friendsList = this.allFriends.friends;
        this.cs.socialLoaded = true;
      })
    }
  }

  getAllFriends() : Promise<any>{
    return this.apiServ.get("social/getAllFriends").then((res: any) => {
      this.allFriends = res;
    }, (error: any) => console.error(error))
  }

  searchFriends(ev: any){
    let name = ev.target.value;
    if(!name){
      this.cs.friendsList = this.allFriends;
    }

    this.cs.friendsList = [];
    for(let friend of this.allFriends){
      let case_sensitive_user_name = friend.name.toLowerCase();
      if(case_sensitive_user_name.includes(name.toLowerCase())){
        if(!this.cs.friendsList.some(friend => friend.name == friend.name)){
          this.cs.friendsList.push(friend);
        }
      }
    }
  }

  sendRequest(friend: User){
    const body = { friendId: friend.user_id }
    this.apiServ.posts('social/sendFriendRequest', body).subscribe({
      next: (response) => {
        if(response.statusMsg){
          this.toastr.error(response.statusMsg);
          return;
        }

        if(response.sender_id){
          this.toastr.success(`Friend Request sent successfully`);
        }
        
      },
      error: (error) => console.error(error)
    });
  }

  
  
}
