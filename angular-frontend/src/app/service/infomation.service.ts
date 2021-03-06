import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfomationService {

  apiUrl:string="https://api.jikan.moe/v3";
  firebaseUrl:string="https://random-website-7f4cf-default-rtdb.firebaseio.com/"
  newApi:string="http://cdn.animenewsnetwork.com/encyclopedia/api.xml"

  constructor(private http: HttpClient,private route:Router) { }

  getAnimeByYearAndSeason(year:string,season:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/season/${year}/${season}`);
  }

  // https://api.jikan.moe/v3/search/anime?q=Fate/Zero&page=1
  getNavSearchResultAnime(keyword:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/search/anime?q=${keyword}&page=1`);
  }
  getNavSearchResultManga(keyword:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/search/manga?q=${keyword}&page=1`);
  }
  getNavSearchResultChar(keyword:string,page:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/search/character?q=${keyword}&page=${page}`);
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
  getAnimeReviews(id:number,page:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/reviews/${page}`);
  }
  getAnimeFBReviews(id:number):Observable<any>{
    return this.http.get(`${this.firebaseUrl}comment/anime/${id}.json`);
  }


  getAnimeRecommendations(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/recommendations`);
  }
  getAnimeVideos(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/videos`);
  }
  getAnimeChars(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/anime/${id}/characters_staff`);
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
  getMangaInfo(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/manga/${id}/pictures`);
  }
  getMangaReviews(id:number,page:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/manga/${id}/reviews/${page}`);
  }
  getMangaFBReviews(id:number):Observable<any>{
    return this.http.get(`${this.firebaseUrl}comment/manga/${id}.json`);
  }
  getMangaRecommendations(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/manga/${id}/recommendations`);
  }
  getMangaChars(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/manga/${id}/characters`);
  }











  getCharacter(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/character/${id}`);
  }
  getCharacterPic(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/character/${id}/pictures`);
  }
  getTopCharacter():Observable<any>{
    return this.http.get(`${this.apiUrl}/top/characters`);
  }
  getTopCharacterPage(page:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/top/characters/${page}`);
  }


}
