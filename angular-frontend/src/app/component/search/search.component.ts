import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('goUp', { static: true }) contentPage!: ElementRef;

  searchMode: number = 1
  isLoading: boolean = false

  type: string = ""
  genre: string = ""
  status: string = ""
  season: string = ""
  year: string = ""
  name: string = ""
  letter: string = ""
  order_by: string = "members"

  results: any[] = []

  pageSize = 50
  pageNumber = 1
  collectionSize = 100

  seasonAnimeData: any[] = []


  constructor(private searchService: SearchService,
    private infoServeice: InfomationService) { }

  ngOnInit(): void {
    this.setValue()
    this.onSearchModeChange()

  }



  setValue() {
    this.searchMode = this.searchService.searchMode
    this.type = this.searchService.type
    this.genre = this.searchService.genre
    this.status = this.searchService.status
    this.season = this.searchService.season
    this.year = this.searchService.year
    this.name = this.searchService.name
    this.letter = this.searchService.letter
  }
  onSearchModeChange() {

    if (this.searchMode == 1) {
      this.onStatusGenreTypeChange()
    }
    else if (this.searchMode == 2) {
      this.onSeasonYearChange()
    }
    else {
      this.onSearchLetterChange(this.letter)
    }
  }
  onStatusGenreTypeChange() {
    this.pageNumber = 1
    this.isLoading = true
    this.searchService.getSearchResultStatusTypeGenre(this.status, this.type, this.genre, this.pageNumber, this.order_by).subscribe(
      data => {
        this.results = data.results
        this.collectionSize = Number(data.last_page) * this.pageSize
        this.isLoading = false
      }
    )
  }
  onStatusGenreTypePageChange() {
    this.isLoading = true
    this.searchService.getSearchResultStatusTypeGenre(this.status, this.type, this.genre, this.pageNumber, this.order_by).subscribe(
      data => {
        this.results = data.results
        this.collectionSize = Number(data.last_page) * this.pageSize
        this.isLoading = false
      }
    )
  }
  onSeasonYearChange() {
    this.pageNumber = 1
    this.isLoading = true
    this.searchService.getSearchResultYearSeason(this.year, this.season).subscribe(
      data => {
        console.log(data.anime)
        this.seasonAnimeData = data.anime
        this.collectionSize = this.seasonAnimeData.length
        this.onSeasonYearPageChange()
        this.isLoading = false
      }
    )
  }
  onSeasonYearPageChange() {
    this.results = []
    for (let i = 0; i < this.pageSize; i++) {
      if(this.seasonAnimeData[i + this.pageSize * (this.pageNumber-1)]!=undefined){
        this.results.push(this.seasonAnimeData[i + this.pageSize * (this.pageNumber-1)])
      }
    }
  }
  onSearchLetterChange(lt: string) {
    this.letter = lt
    this.pageNumber = 1
    this.isLoading = true
    this.searchService.getSearchResultLetter(this.letter, this.pageNumber).subscribe(
      data => {
        this.results = data.results
        this.collectionSize = Number(data.last_page) * this.pageSize
        this.isLoading = false
      }
    )
  }
  onSearchLetterPageChange() {
    this.isLoading = true
    this.searchService.getSearchResultLetter(this.letter, this.pageNumber).subscribe(
      data => {
        this.results = data.results
        this.collectionSize = Number(data.last_page) * this.pageSize
        this.isLoading = false
      }
    )
  }
  showUp() {
    this.contentPage.nativeElement.scrollIntoView();
  }

}
