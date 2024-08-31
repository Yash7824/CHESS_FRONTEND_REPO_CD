import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private apiServ: ApiService,
    private router: Router,
    private cs: CommonService
  ){}

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  hide = true;
  matcher = new MyErrorStateMatcher();
  
 
  loginButton(){
    let loginForm = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value
    }

    this.apiServ.login(loginForm).subscribe({
      next: (response) => {
        sessionStorage.setItem('authToken', JSON.stringify(response));
        this.cs.isLoggedIn = true;
        this.router.navigateByUrl('home');
      },
      error: err => console.error('Observable emitted an error: ' + err)
      // complete: () => console.log('Observable emitted the complete notification')
    })
  }
}
