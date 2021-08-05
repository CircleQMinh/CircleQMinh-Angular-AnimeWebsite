import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  rf1!: FormGroup;

  showFormError:boolean=false


  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.rf1 = new FormGroup({
      email: new FormControl('',
      [Validators.required, Validators.email]),
      password: new FormControl('',
      [Validators.required, Validators.minLength(8)]),
      username: new FormControl('',
      [Validators.required, Validators.minLength(3)])
    });
  }

  trySignUp() {
    this.showFormError=true
    if(this.rf1.valid){
      console.log(this.rf1.controls['email'].value)
      console.log(this.rf1.controls['password'].value)
      console.log(this.rf1.controls['username'].value)
     // this.authService.signUp()
    }
  }
}
