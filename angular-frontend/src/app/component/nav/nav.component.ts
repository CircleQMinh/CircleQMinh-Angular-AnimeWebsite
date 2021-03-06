import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  email!: string
  uid!: string
  username!: string;
  url!: string;
  isCollapsed: boolean = true
  isLogin: boolean = false

  manga_url: string[] = ["manga", "read"]
  anime_url: string[] = ["anime", "watch"]


  constructor(private infoService: InfomationService, private searchService: SearchService, private renderer: Renderer2,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.getLocalStorage()

    let a = this.checkLink()
    if (a == 0) {
      this.url = "anime"
      this.renderer.addClass(document.body, 'body-anime');
      this.renderer.removeClass(document.body, 'body-manga');
    }
    else if (a == 1) {
      this.url = "manga"
      this.renderer.addClass(document.body, 'body-manga');
      this.renderer.removeClass(document.body, 'body-anime');
    }
    else {
      this.url = "other"
      this.renderer.addClass(document.body, 'body-anime');
      this.renderer.removeClass(document.body, 'body-manga');
    }

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
  signOut() {
    this.authService.isLogin = false
    this.isLogin = false
    let a = this.router.url
    localStorage.removeItem("isLogin")
    localStorage.removeItem("uid")
    localStorage.removeItem("email")
    localStorage.removeItem("timeOut")
    localStorage.removeItem("username")


    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }

  checkLink(): number {
    let s = this.router.url
    for (let i = 0; i < this.manga_url.length; i++) {
      if (s.includes(this.manga_url[i])) {
        return 1
      }
    }
    for (let i = 0; i < this.anime_url.length; i++) {
      if (s.includes(this.anime_url[i])) {
        return 0
      }
    }

    return 69
  }


  goToSearchGenre(genre: number) {
    this.searchService.searchMode = 1
    
    if (genre == null) {
      this.searchService.genre = String("")
    }
    else {
      this.searchService.genre = String(genre)
    }
    if(this.url=="anime"){
      this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/search/anime']));
    }
    else{
      this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/search/manga']));
    }

  
  }
  goToSearchStatus(ss: string) {
    this.searchService.searchMode = 1
    if (ss == null) {
      this.searchService.status = String("")
    }
    else {
      this.searchService.status = String(ss)
    }

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/search']));
  }
  goToSearchSeason() {
    this.searchService.searchMode = 2
    let today: Date = new Date()
    this.searchService.season = this.getCurrentSeason(today.getMonth())
    this.router.navigateByUrl("/search")
  }
  goToSearchYear(y: string) {
    this.searchService.searchMode = 2
    this.searchService.year = y
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/search']));
  }
  goToSearchLetter() {
    this.searchService.searchMode = 3
    this.router.navigateByUrl("/search")
  }
  getCurrentSeason(month: number): string {
    if (month < 3) {
      return "winter"
    }
    else if (month >= 3 && month < 6) {
      return "spring"
    }
    else if (month >= 6 && month < 9) {
      return "summer"
    }
    else {
      return "fall"
    }
  }

}
