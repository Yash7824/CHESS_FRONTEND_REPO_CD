import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  homeLoaded: boolean = false;
  socialLoaded: boolean = false;
  constructor() { }
}