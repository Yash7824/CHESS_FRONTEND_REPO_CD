import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUp } from '../models/SignUp.js';
import { Observable } from 'rxjs';
import { SignUpResponse } from '../models/SignUpResponse';
import { environment } from 'src/environments/environment';
import { Login } from '../models/Login';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  signUp_Url: string = 'auth/signUp';
  login_Url: string = 'auth/login';
  getUser_Url: string = 'auth/getUser';
  authToken: string = '';

  httpHeaders: HttpHeaders = new HttpHeaders({
    'auth-token': this.authToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type'
});

  public signUp(signUp: SignUp): Observable<SignUpResponse>{
    return this.http.post<SignUpResponse>(`${environment.base_url}/${this.signUp_Url}`, signUp);
  }

  public login(login: Login): Observable<any>{
    return this.http.post<any>(`${environment.base_url}/${this.login_Url}`, login);
  }

  public getUser(): Observable<User>{
    let authorizationToken = JSON.parse(sessionStorage.getItem('authToken') || '');
    let httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('auth-token', authorizationToken.authToken);
    httpHeaders = httpHeaders.append('Content-Type', 'application/json');
    httpHeaders = httpHeaders.append('Accept', 'application/json');
    httpHeaders = httpHeaders.append('Access-Control-Allow-Headers', 'Content-Type');
    return this.http.get<User>(`${environment.base_url}/${this.getUser_Url}`, { headers: httpHeaders })
  }
}
