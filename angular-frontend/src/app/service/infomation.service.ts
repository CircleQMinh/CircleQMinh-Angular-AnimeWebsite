import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfomationService {

  apiUrl:string="https://api.jikan.moe/v3";
  constructor(private http: HttpClient,private route:Router) { }

  getAnimeByYearAndSeason(year:string,season:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/season/${year}/${season}`);
  }
  // https://api.jikan.moe/v3/search/anime?q=Fate/Zero&page=1
  getNavSearchResult(keyword:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/search/anime?q=${keyword}&page=1`);
  }
  getTopUpCommingAnime():Observable<any>{
    return this.http.get(`${this.apiUrl}/top/anime/1/upcoming`);
  }

  getAnimeNews(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/news`);
  }
}
