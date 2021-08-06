import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styleUrls: ['./password-recover.component.css']
})
export class PasswordRecoverComponent implements OnInit {
  rf1!: FormGroup;
  showFormError: boolean = false
  email_send:boolean=false

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email])
    });
  }

  tryRecover(){
    this.showFormError=true
    if(this.rf1.valid){
      this.email_send=true
      this.authService.recoverPassword(this.rf1.controls["email"].value).subscribe(
        data=>{
          console.log(data)
          
        }
      )
    }
  }
}
