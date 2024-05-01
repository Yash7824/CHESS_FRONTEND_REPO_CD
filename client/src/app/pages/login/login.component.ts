import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private apiServ: ApiService,
    private router: Router
  ){}
  loginForm = {
    email: '',
    password: ''
  }

  loginButton(){
    this.apiServ.login(this.loginForm).subscribe({
      next: (response) => {
        sessionStorage.setItem('authToken', JSON.stringify(response));
        this.router.navigateByUrl('home');
      },
      error: err => console.error('Observable emitted an error: ' + err)
      // complete: () => console.log('Observable emitted the complete notification')
    })
  }
}
