import { Component, OnInit } from '@angular/core';
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

  clickedItem: any;

  results: { name: string, imgurl: string, id: string }[] = []
  constructor(private infoService: InfomationService,private searchService:SearchService,
    private router: Router) { }
  keyword!: string;
  searchData: any[] = []
  @ViewChild('instance', { static: true })
  instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly { name: string, imgurl: string, id: string  }[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.results
        : this.results.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 7))
    );
  }
  formatter = (x: { name: string }) => x.name;
  ngOnInit(): void {
  }

  selectedItem(item: any) {
    this.clickedItem = item.item;
    console.log(item);

    // let a : {name: string, flag: string} ={'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'}
  }
  getInfo() {
    if(this.keyword.length>2){
      this.infoService.getNavSearchResult(this.keyword).subscribe(
        data=>{
          this.searchData=data.results
          this.results=[]
      
          this.searchData.forEach(element => {
            let item : {name:string, imgurl: string, id: string }={'name':element.title,'imgurl':element.image_url,'id':element.mal_id}
            this.results.push(item)

          });

        },
        error=>{

        }
      )
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
