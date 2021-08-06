import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  rf1!: FormGroup;

  showFormError: boolean = false
  email_exist_error: boolean = false
  unknown_error: boolean = false
  username_exist_error: boolean = false

  id: string = ""

  isRegistered:boolean=false
  isLoading: boolean = false
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
    this.showFormError = true
    this.email_exist_error = false
    this.unknown_error = false
    this.username_exist_error = false
    this.isLoading = true

    if (this.rf1.valid) {
      this.authService.getUserInfoByUsername(this.rf1.controls['username'].value).pipe(map(
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
        data => {
          let a = data.pop()
          //console.log(a)
          if (a) {

            this.username_exist_error = true
            this.isLoading = false
          }
          else {
            this.signUp()
          }

        },
        error => {
          this.username_exist_error = true
          console.log(error)
          this.isLoading = false
        }
      )

    }

  }
  signUp() {

    this.isLoading = true
    if (this.rf1.valid) {
      // console.log(this.rf1.controls['email'].value)
      // console.log(this.rf1.controls['password'].value)
      // console.log(this.rf1.controls['username'].value)
      this.authService.signUp(this.rf1.controls['email'].value, this.rf1.controls['password'].value).subscribe(
        data => {
          this.id = data.localId
          this.saveUserData()
          this.isLoading = false
          this.isRegistered=true
        },
        error => {
          console.log(error.error.error.message)
          if (error.error.error.message == "EMAIL_EXISTS") {
            this.email_exist_error = true
            this.isLoading = false
          }
          else if (error.error.error.message == "OPERATION_NOT_ALLOWED" || error.error.error.message == "ETOO_MANY_ATTEMPTS_TRY_LATER") {
            this.unknown_error = true
            this.isLoading = false
          }
        }
      )
    }
  }
  saveUserData() {
    let postData: { username: string, email: string, id: string } = {
      username: this.rf1.controls['username'].value,
      email: this.rf1.controls['email'].value, id: this.id
    }
    this.authService.saveUserInfo(this.id, postData).subscribe(
      data => {
      }
    )
  }
}
