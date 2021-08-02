import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, OperatorFunction, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {


  username!: string;
  url!: string;
  isCollapsed: boolean = true

  clickedItem: any;

  keywordError: boolean = false
  isLoading: boolean = false


  results: { name: string, imgurl: string, id: string }[] = []
  constructor(private infoService: InfomationService, private router: Router) { }
  keyword!: string;
  searchData: any[] = []
  @ViewChild('instance', { static: true })
  instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly { name: string, imgurl: string, id: string }[]> = (text$: Observable<string>) => {
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
    if (this.router.url == "/anime") {
      this.url = "anime"
    }
    else if (this.router.url == "/manga") {
      this.url = "manga"
    }
    else {
      this.url = "other"
    }
  }

  selectedItem(item: any) {
    this.clickedItem = item.item;
    if (this.router.url == "/anime") {
      this.router.navigateByUrl(`/anime/${this.clickedItem.id}`)
    }
    else{
      this.router.navigateByUrl(`/manga/${this.clickedItem.id}`)
    }
   
    // let a : {name: string, flag: string} ={'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'}
  }
  getInfo() {
    this.keywordError = false

    if (this.keyword.length > 2) {
      this.isLoading = true
      if (this.router.url == "/anime") {
        this.infoService.getNavSearchResultAnime(this.keyword).subscribe(
          data => {
            this.searchData = data.results
            this.results = []
  
            this.searchData.forEach(element => {
              let item: { name: string, imgurl: string, id: string } = { 'name': element.title, 'imgurl': element.image_url, 'id': element.mal_id }
              this.results.push(item)
  
            });
  
            this.isLoading = false
          },
          error => {
  
          }
        )
      }
      else if (this.router.url == "/manga") {
        this.infoService.getNavSearchResultManga(this.keyword).subscribe(
          data => {
            this.searchData = data.results
            this.results = []
  
            this.searchData.forEach(element => {
              let item: { name: string, imgurl: string, id: string } = { 'name': element.title, 'imgurl': element.image_url, 'id': element.mal_id }
              this.results.push(item)
  
            });
  
            this.isLoading = false
          },
          error => {
  
          }
        )
      }
      
    }
    else {
      this.keywordError = true;
    }
  }

}