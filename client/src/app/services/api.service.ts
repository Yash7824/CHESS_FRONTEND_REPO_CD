import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUp } from '../models/signUp';
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
    return this.http.post<SignUpResponse>(`${environment.base_url}/signUp_Url`, signUp);
  }

  public login(login: Login): Observable<string>{
    return this.http.post<string>(`${environment.base_url}/login_Url`, login);
  }

  public getUser(): Observable<User>{
    return this.http.get<User>(`${environment.base_url}/getUser_Url`, { headers: this.httpHeaders })
  }
}
