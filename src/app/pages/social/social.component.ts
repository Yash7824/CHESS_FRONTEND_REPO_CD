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

  allUsers: any;
  constructor(public apiServ: ApiService, public cs: CommonService){}

  ngOnInit(){
    if(!this.cs.socialLoaded){
      this.getAllUsers().then((val: any) => {
        this.cs.friendsList = this.allUsers;
        this.cs.socialLoaded = true;
      })
    }
  }

  searchFriends(ev: any){
    let name = ev.target.value;
    if(!name){
      this.cs.friendsList = this.allUsers;
    }

    this.cs.friendsList = [];
    for(let user of this.allUsers){
      let case_sensitive_user_name = user.name.toLowerCase();
      if(case_sensitive_user_name.includes(name.toLowerCase())){
        if(!this.cs.friendsList.some(friend => friend.name == user.name)){
          this.cs.friendsList.push(user);
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
