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
    return this.http.get(`${this.apiUrl}/season`);
  }

  // https://api.jikan.moe/v3/search/anime?q=Fate/Zero&page=1
  getNavSearchResultAnime(keyword:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/search/anime?q=${keyword}&page=1`);
  }
  getNavSearchResultManga(keyword:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/search/manga?q=${keyword}&page=1`);
  }
  getTopUpCommingAnime():Observable<any>{
    return this.http.get(`${this.apiUrl}/top/anime/1/upcoming`);
  }

  getAnimeNews(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/news`);
  }
  getAnimeByPopularity():Observable<any>{
    return this.http.get(`${this.apiUrl}/top/anime/1/favorite`);
  }
  getAnimeSchedule(day:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/schedule/${day}`);
  }
  getAnime(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}`);
  }
  getAnimeEp(id:number,ep:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/episodes/${ep}`);
  }












  getMangaNewest():Observable<any>{
    return this.http.get(`${this.apiUrl}/search/manga?q=&order_by=members&sort=desc`);
  }
  getMangaChapterLong():Observable<any>{
    return this.http.get(`${this.apiUrl}/search/manga?q=&order_by=chapters&sort=desc`);
  }
  getMangaTopRating():Observable<any>{
    return this.http.get(`${this.apiUrl}/search/manga?q=&order_by=score&sort=desc`);
  }
  getManga(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/manga/${id}`);
  }
}
