import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  rf1!: FormGroup;

  showFormError: boolean = false
  login_error: boolean = false

  isLogin: boolean = true
  idLogin: string = ""
  emailLogin: string = "???"

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.getInfo()

    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    });
  }

  getInfo() {
    this.isLogin = this.authService.isLogin
    this.emailLogin = this.authService.emailLogin
    this.idLogin = this.authService.idLogin
  }
  trySignIn() {
    this.showFormError = true
    if (this.rf1.valid) {
      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      this.authService.signIn(this.rf1.controls['email'].value, this.rf1.controls['password'].value).subscribe(
        data => {
          //console.log(data)
          this.authService.isLogin = true
          this.isLogin = true
          this.authService.idLogin = data.localId
          this.authService.emailLogin = data.email
          this.getInfo()
          this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/login']));
        },
        error => {
          console.log(error)
        }
      )
    }
  }
}
