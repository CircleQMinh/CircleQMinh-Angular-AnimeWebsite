import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  username!: string;
  url!: string;
  isCollapsed: boolean = true




  constructor(private infoService: InfomationService,private searchService:SearchService,private renderer: Renderer2,
    private router: Router) { }

  ngOnInit(): void {

    if(this.router.url=="/anime"){
      this.url="anime"
      this.renderer.addClass(document.body, 'body-anime');
      this.renderer.removeClass(document.body, 'body-manga');
    }
    else if(this.router.url=="/manga"){
      this.url="manga"
      this.renderer.addClass(document.body, 'body-manga');
      this.renderer.removeClass(document.body, 'body-anime');
    }
    else{
      this.url="other"
      this.renderer.addClass(document.body, 'body-anime');
      
    }

  }



  goToSearchGenre(genre:number){
    this.searchService.searchMode=1
    if(genre==null){
      this.searchService.genre=String("")
    }
    else{
      this.searchService.genre=String(genre)
    }

    
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/search']));
  }
  goToSearchStatus(ss:string){
    this.searchService.searchMode=1
    if(ss==null){
      this.searchService.status=String("")
    }
    else{
      this.searchService.status=String(ss)
    }

    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/search']));
  }
  goToSearchSeason(){
    this.searchService.searchMode=2
    let today:Date=new Date()
    this.searchService.season=this.getCurrentSeason(today.getMonth())
    this.router.navigateByUrl("/search")
  }
  goToSearchYear(y:string){
    this.searchService.searchMode=2
    this.searchService.year=y
    this.router.navigateByUrl('/', {skipLocationChange: true})
    .then(() => this.router.navigate(['/search']));
  }
  goToSearchLetter(){
    this.searchService.searchMode=3
    this.router.navigateByUrl("/search")
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
