import { Component, OnInit, ViewChild } from '@angular/core';
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
  constructor(private infoService: InfomationService) { }
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
  }

  selectedItem(item: any) {
    this.clickedItem = item.item;
    console.log(item);

    // let a : {name: string, flag: string} ={'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'}
  }
  getInfo() {
    this.keywordError = false

    if (this.keyword.length > 2) {
      this.isLoading=true
      this.infoService.getNavSearchResult(this.keyword).subscribe(
        data => {
          this.searchData = data.results
          this.results = []

          this.searchData.forEach(element => {
            let item: { name: string, imgurl: string, id: string } = { 'name': element.title, 'imgurl': element.image_url, 'id': element.mal_id }
            this.results.push(item)

          });

          this.isLoading=false
        },
        error => {

        }
      )
    }
    else{
      this.keywordError=true;
    }
  }
 
}