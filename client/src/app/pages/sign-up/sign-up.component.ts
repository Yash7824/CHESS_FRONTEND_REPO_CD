import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  constructor(private apiServ: ApiService,
    private router: Router
  ){}

  signUpForm = {
    name: '',
    email: '',
    password: '',
    repeat_password: ''
  };

  signUp(){
    this.apiServ.signUp(this.signUpForm).subscribe({
      next: (response) => {
        sessionStorage.setItem('signUpToken', JSON.stringify(response));
        this.router.navigateByUrl('/login')
      },
      error: err => console.error('Observable emitted an error: ' + err)
      // complete: () => console.log('Observable emitted the complete notification')
    })
  }
}
