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
  authToken: string = '';

  public signUp(signUp: SignUp): Observable<SignUpResponse>{
    return this.http.post<SignUpResponse>(`${environment.base_url}/${this.signUp_Url}`, signUp);
  }

  public login(login: Login): Observable<any>{
    return this.http.post<any>(`${environment.base_url}/${this.login_Url}`, login);
  }

  public get(endpoint: any): Promise<any>{
    let authorizationToken = JSON.parse(sessionStorage.getItem('authToken') || '');
    let httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('auth-token', authorizationToken.authToken);
    httpHeaders = httpHeaders.append('Content-Type', 'application/json');
    httpHeaders = httpHeaders.append('Accept', 'application/json');
    httpHeaders = httpHeaders.append('Access-Control-Allow-Headers', 'Content-Type');
    return this.http.get<any>(`${environment.base_url}/${endpoint}`, { headers: httpHeaders }).toPromise();
  }

  public gets(endpoint: any): Observable<any>{
    let authorizationToken = JSON.parse(sessionStorage.getItem('authToken') || '');
    let httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('auth-token', authorizationToken.authToken);
    httpHeaders = httpHeaders.append('Content-Type', 'application/json');
    httpHeaders = httpHeaders.append('Accept', 'application/json');
    httpHeaders = httpHeaders.append('Access-Control-Allow-Headers', 'Content-Type');
    return this.http.get<any>(`${environment.base_url}/${endpoint}`, { headers: httpHeaders });
  }

  public post(endpoint: any, body: any): Promise<any>{
    let authorizationToken = JSON.parse(sessionStorage.getItem('authToken') || '');
    let httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('auth-token', authorizationToken.authToken);
    httpHeaders = httpHeaders.append('Content-Type', 'application/json');
    httpHeaders = httpHeaders.append('Accept', 'application/json');
    httpHeaders = httpHeaders.append('Access-Control-Allow-Headers', 'Content-Type');
    return this.http.post<User>(`${environment.base_url}/${endpoint}`, body, { headers: httpHeaders }).toPromise();
  }

  public posts(endpoint: any, body: any): Observable<any>{
    let authorizationToken = JSON.parse(sessionStorage.getItem('authToken') || '');
    let httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('auth-token', authorizationToken.authToken);
    httpHeaders = httpHeaders.append('Content-Type', 'application/json');
    httpHeaders = httpHeaders.append('Accept', 'application/json');
    httpHeaders = httpHeaders.append('Access-Control-Allow-Headers', 'Content-Type');
    return this.http.post<any>(`${environment.base_url}/${endpoint}`, body, { headers: httpHeaders })
  }
}
