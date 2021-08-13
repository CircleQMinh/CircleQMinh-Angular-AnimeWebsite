import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  fb_auth_api="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  fb_sign_api="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  fb_api_key="AIzaSyB5lX0Z378Eyh02XUSUjuiTzR9erGwho1A"
  fb_recover="https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="
  firebaseUrl:string="https://random-website-7f4cf-default-rtdb.firebaseio.com/"
  isLogin:boolean=false
  
  idLogin:string=""
  emailLogin:string=""
  userLogin:string=""

  constructor(private http: HttpClient,private route:Router) { }


  signUp(email:string,password:string):Observable<any>{
    return this.http.post(`${this.fb_auth_api}${this.fb_api_key}`,{
      email:email,
      password:password,
      returnSecureToken:true})
  }

  signIn(email:string,password:string):Observable<any>{
    return this.http.post(`${this.fb_sign_api}${this.fb_api_key}`,{
      email:email,
      password:password,
      returnSecureToken:true})
  }
  recoverPassword(email:string):Observable<any>{
    return this.http.post(`${this.fb_recover}${this.fb_api_key}`,{
      email:email,
      requestType:"PASSWORD_RESET"})
  }

  saveUserInfo(id:string,postData:{username:string;email:string,id:string}):Observable<any>{
    return this.http.post(`${this.firebaseUrl}user.json`,postData)
  }

  getUserInfo(id:string):Observable<any>{
    return this.http.get(`${this.firebaseUrl}user.json?orderBy="id"&equalTo="${id}"&print=pretty`)
  }
  
  getUserInfoByUsername(un:string):Observable<any>{
    return this.http.get(`${this.firebaseUrl}user.json?orderBy="username"&equalTo="${un}"&print=pretty`)
  }


  postAnimeComment(anime_id:number,username:string,content:string,rating:number,date:string):Observable<any>{
    return this.http.post(`${this.firebaseUrl}comment/anime/${anime_id}.json`,{
      username:username,
      content:content,
      rating:rating,
      date:date})
  }
  postMangaComment(manga_id:number,username:string,content:string,rating:number,date:string):Observable<any>{
    return this.http.post(`${this.firebaseUrl}comment/manga/${manga_id}.json`,{
      username:username,
      content:content,
      rating:rating,
      date:date})
  }

  addFavAnime(user_id:string,anime_id:number,url:string,name:string):Observable<any>{
    return this.http.post(`${this.firebaseUrl}favorite/anime.json`,{
      user_id:user_id,
      anime_id:anime_id,
      url:url,
      anime:name})
  }
  getUserFavAnime(uid:string):Observable<any>{
    return this.http.get(`${this.firebaseUrl}favorite/anime.json?orderBy="user_id"&equalTo="${uid}"&print=pretty`)
  }

  addFavManga(user_id:string,manga_id:number,url:string,name:string):Observable<any>{
    return this.http.post(`${this.firebaseUrl}favorite/manga.json`,{
      user_id:user_id,
      manga_id:manga_id,
      url:url,
      manga:name})
  }
  getUserFavManga(uid:string):Observable<any>{
    return this.http.get(`${this.firebaseUrl}favorite/manga.json?orderBy="user_id"&equalTo="${uid}"&print=pretty`)
  }
  addFavCharacter(user_id:string,char_id:number,url:string,name:string):Observable<any>{
    return this.http.post(`${this.firebaseUrl}favorite/character.json`,{
      user_id:user_id,
      char_id:char_id,
      url:url,
      char:name})
  }
  getUserFavCharacter(uid:string):Observable<any>{
    return this.http.get(`${this.firebaseUrl}favorite/character.json?orderBy="user_id"&equalTo="${uid}"&print=pretty`)
  }
}
