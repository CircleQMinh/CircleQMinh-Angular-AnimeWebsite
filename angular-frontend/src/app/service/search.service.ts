import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  apiUrl:string="https://api.jikan.moe/v3";

  searchMode:number=1
  searchType:string="anime"

  type:string=""
  genre:string=""
  status:string=""
  season:string=""
  year:string=""
  name:string=""
  letter:string=""
  order_by:string=""

  constructor(private http: HttpClient,private route:Router) { }

  getSearchResultStatusTypeGenreAnime(status:string,type:string,genre:string,page:number,order_by:string):Observable<any>{
    let stringRequest:string=this.apiUrl+"/search/anime?q="
    if(status.trim().length>0){
      stringRequest+=`&status=${status}`
    }
    if(type.trim().length>0){
      stringRequest+=`&type=${type}`
    }
    if(genre.trim().length>0){
      stringRequest+=`&genre=${genre}`
    }
    if(order_by.trim().length>0){
      stringRequest+=`&order_by=${order_by}`
    }
    stringRequest+=`&page=${page}`
    return this.http.get(stringRequest);
  }
  getSearchResultStatusTypeGenreManga(status:string,type:string,genre:string,page:number,order_by:string):Observable<any>{
    let stringRequest:string=this.apiUrl+"/search/manga?q="
    if(status.trim().length>0){
      stringRequest+=`&status=${status}`
    }
    if(type.trim().length>0){
      stringRequest+=`&type=${type}`
    }
    if(genre.trim().length>0){
      stringRequest+=`&genre=${genre}`
    }
    if(order_by.trim().length>0){
      stringRequest+=`&order_by=${order_by}`
    }
    stringRequest+=`&page=${page}`
    return this.http.get(stringRequest);
  }
  getSearchResultYearSeasonAnime(year:string,season:string):Observable<any>{
    let stringRequest:string=this.apiUrl+"/season"
    let today:Date=new Date()
    if(year.trim().length==0){
      stringRequest+=`/${today.getFullYear()}` 
    }
    else{
      stringRequest+=`/${year}`
    }
    if(season.trim().length==0){
      stringRequest+=`/${this.getCurrentSeason(today.getMonth())}`
    }
    else{
      stringRequest+=`/${season}`
    }
    return this.http.get(stringRequest);
  }
  getSearchResultYearSeasonManga(year:string,season:string):Observable<any>{
    let stringRequest:string=this.apiUrl+"/season"
    let today:Date=new Date()
    if(year.trim().length==0){
      stringRequest+=`/${today.getFullYear()}` 
    }
    else{
      stringRequest+=`/${year}`
    }
    if(season.trim().length==0){
      stringRequest+=`/${this.getCurrentSeason(today.getMonth())}`
    }
    else{
      stringRequest+=`/${season}`
    }
    return this.http.get(stringRequest);
  }

  getSearchResultLetterAnime(letter:string,page:number):Observable<any>{
    let stringRequest:string=this.apiUrl+"/search/anime?q=&order_by=members"
    if(letter.trim().length>0){
      stringRequest+=`&letter=${letter}`
    }
    stringRequest+=`&page=${page}`
    return this.http.get(stringRequest);
  }

  getSearchResultLetterManga(letter:string,page:number):Observable<any>{
    let stringRequest:string=this.apiUrl+"/search/manga?q=&order_by=members"
    if(letter.trim().length>0){
      stringRequest+=`&letter=${letter}`
    }
    stringRequest+=`&page=${page}`
    return this.http.get(stringRequest);
  }


  getCurrentSeason(month:number):string{
    if(month<3){
      return "winter"
    }
    else if(month>=3&&month<6){
      return "spring"
    }
    else if(month>=6&&month<9){
      return "summer"
    }
    else {
      return "fall"
    }
  }

}
