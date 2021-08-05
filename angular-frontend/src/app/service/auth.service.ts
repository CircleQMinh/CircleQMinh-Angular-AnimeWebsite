import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private route:Router) { }


  signUp(email:string,password:string):Observable<any>{
    return this.http.post("",{
      email:email,
      password:password,
      returnSecureToken:true})
  }
}
