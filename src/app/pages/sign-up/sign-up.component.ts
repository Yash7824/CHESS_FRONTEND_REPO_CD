import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  constructor(private apiServ: ApiService,
    private router: Router
  ){}

  nameFormControl = new FormControl('', [Validators.required])
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  repeatPasswordFormControl = new FormControl('', [Validators.required]);
  hide1 = true;
  hide2 = true;
  matcher = new MyErrorStateMatcher();

  signUp(){
    let signUpForm = {
      name: this.nameFormControl.value,
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value,
      repeat_password: this.repeatPasswordFormControl.value
    }

    this.apiServ.signUp(signUpForm).subscribe({
      next: (response) => {
        sessionStorage.setItem('signUpToken', JSON.stringify(response));
        this.router.navigateByUrl('')
      },
      error: err => console.error('Observable emitted an error: ' + err)
      // complete: () => console.log('Observable emitted the complete notification')
    })
  }
}
