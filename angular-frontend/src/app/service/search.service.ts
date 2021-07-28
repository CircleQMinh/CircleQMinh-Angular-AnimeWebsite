import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  apiUrl:string="https://api.jikan.moe/v3";
  type:string=""
  genre:string=""
  status:string=""
  
  constructor(private http: HttpClient,private route:Router) { }

  getAnimeNews(status:string,genre:string,type:string):Observable<any>{
    let stringRequest:string=this.apiUrl+"/search/anime?"


    return this.http.get(`${this.apiUrl}/anime/${0}/news`);
  }
}
