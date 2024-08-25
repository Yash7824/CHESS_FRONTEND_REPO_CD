import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { FriendRequest } from '../models/FriendRequest';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  homeLoaded: boolean = false;
  socialLoaded: boolean = false;
  friendsList: User[] = [];
  getUser!: User;
  getFriendRequestList: FriendRequest[] = [];
  constructor() { }

  IsUndefinedOrNull(data: any){
    return (data == null || data == undefined || data == '' || data.length == 0);
  }
}
