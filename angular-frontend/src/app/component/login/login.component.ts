import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
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
  isLoading:boolean=false
  isLogin: boolean = false
  email!: string
  uid!: string
  username!: string;

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    //this.getInfo()
    this.getLocalStorage()
    this.rf1 = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    });
  }



  getLocalStorage() {
    if(localStorage.getItem("isLogin")){
   
      let timeOut= new Date(localStorage.getItem("timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("uid")
        localStorage.removeItem("email")
        localStorage.removeItem("timeOut")
        localStorage.removeItem("username")
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.uid = localStorage.getItem('uid')!
        this.email = localStorage.getItem("email")!
        this.username = localStorage.getItem("username")!
        this.authService.isLogin=this.isLogin
        this.authService.idLogin=this.uid
        this.authService.emailLogin=this.email
        this.authService.userLogin=this.username
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

  }



  trySignIn() {
    this.showFormError = true
    if (this.rf1.valid) {
      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      this.isLoading=true
      this.authService.signIn(this.rf1.controls['email'].value, this.rf1.controls['password'].value).subscribe(
        data => {

          localStorage.setItem('isLogin', "true")
          localStorage.setItem("uid",data.localId)
          localStorage.setItem("email",data.email)
          let a = new Date()
          a.setMinutes(a.getMinutes()+120)
          localStorage.setItem("timeOut",formatDate(a, 'MMMM d, y, hh:mm:ss a z', 'en'))
          this.getUserInfo()
         
        },
        error => {
          console.log(error)
          this.isLoading=false
          this.login_error=true
        }
      )
    }
  }
  getUserInfo(){
    this.authService.getUserInfo(this.authService.idLogin).pipe(map(
      data => {
        const postsArray = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            postsArray.push({ ...data[key], id: key });
          }
        }
        return postsArray;
      }
    )).subscribe(
      data=>{
        let a=data.pop()
       // console.log(a)
        localStorage.setItem("username",a.username)
        this.router.navigateByUrl('/', {skipLocationChange: true})
        .then(() => this.router.navigate(['/login']));
      }
    )
  }
}
