import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  homeLoaded: boolean = false;
  socialLoaded: boolean = false;
  friendsList: User[] = [];
  getUser!: User;
  constructor() { }
}
