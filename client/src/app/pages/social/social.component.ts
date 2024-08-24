import { Component, OnInit } from '@angular/core';
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

  friendsList: User[] = [];
  allUsers: any;
  constructor(public apiServ: ApiService, private cs: CommonService){}

  ngOnInit(){
    if(!this.cs.socialLoaded){
      this.getAllUsers().then((val: any) => {
        this.friendsList = this.allUsers;
        this.cs.socialLoaded = true;
      })
    }
  }

  searchFriends(ev: any){
    let name = ev.target.value;
    if(!name){
      this.friendsList = this.allUsers;
    }

    this.friendsList = [];
    for(let user of this.allUsers){
      let case_sensitive_user_name = user.name.toLowerCase();
      if(case_sensitive_user_name.includes(name.toLowerCase())){
        if(!this.friendsList.some(friend => friend.name == user.name)){
          this.friendsList.push(user);
        }
      }
    }
  }

  
  getAllUsers() : Promise<any>{
    return this.apiServ.get("admin/getAllUsers").then((res: any) => {
      this.allUsers = res;
    }, (error: any) => console.error(error)
    )}
}
