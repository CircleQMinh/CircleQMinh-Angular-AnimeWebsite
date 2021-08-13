import { Renderer2 } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchMode: number = 1
  url: any
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

  current_year = 2021
  current_season = "summer"

  constructor(private searchService: SearchService, private router: Router, private renderer: Renderer2,
    private route: ActivatedRoute,
    private infoServeice: InfomationService) { }

  ngOnInit(): void {
    let a = new Date()
    this.current_season = this.getCurrentSeason(a.getMonth())
    this.current_year = a.getFullYear()
    this.route.paramMap.subscribe(params => {
      // console.log(this.router.url)
      if (this.router.url == "/search/anime") {
        this.url = "anime"
        this.renderer.addClass(document.body, 'body-anime');
        this.renderer.removeClass(document.body, 'body-manga');
      }
      else if (this.router.url == "/search/manga") {
        this.url = "manga"
        this.renderer.addClass(document.body, 'body-manga');
        this.renderer.removeClass(document.body, 'body-anime');

      }
      else {
        this.url = "other"
        this.renderer.addClass(document.body, 'body-anime');

      }
      this.url = this.route.snapshot.paramMap.get("url");
      this.setValue()
      this.onSearchModeChange()
    })

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

  setValue() {
    this.searchMode = this.searchService.searchMode
    this.type = this.searchService.type
    this.genre = this.searchService.genre
    this.status = this.searchService.status
    this.season = this.searchService.season
    this.year = this.searchService.year
    this.name = this.searchService.name
    this.letter = this.searchService.letter
    if (this.searchMode == 2 && this.url == "manga") {
      this.searchMode = 1
    }
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
    if (this.url == "anime") {
      this.searchService.getSearchResultStatusTypeGenreAnime(this.status, this.type, this.genre, this.pageNumber, this.order_by).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }
    else {
      this.searchService.getSearchResultStatusTypeGenreManga(this.status, this.type, this.genre, this.pageNumber, this.order_by).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }

  }
  onStatusGenreTypePageChange() {
    this.isLoading = true
    if (this.url == "anime") {
      this.searchService.getSearchResultStatusTypeGenreAnime(this.status, this.type, this.genre, this.pageNumber, this.order_by).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }
    else {
      this.searchService.getSearchResultStatusTypeGenreManga(this.status, this.type, this.genre, this.pageNumber, this.order_by).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }

  }
  onSeasonYearChange() {

    this.pageNumber = 1
    this.isLoading = true
    if (this.url == "anime") {
      this.searchService.getSearchResultYearSeasonAnime(this.year, this.season).subscribe(
        data => {
         // console.log(data.anime)
          this.seasonAnimeData = data.anime
          this.collectionSize = this.seasonAnimeData.length
          this.onSeasonYearPageChange()
          this.isLoading = false
        }
      )
    }
    else {
      this.searchService.getSearchResultYearSeasonManga(this.year, this.season).subscribe(
        data => {
         // console.log(data.anime)
          this.seasonAnimeData = data.anime
          this.collectionSize = this.seasonAnimeData.length
          this.onSeasonYearPageChange()
          this.isLoading = false
        }
      )
    }

  }
  onSeasonYearPageChange() {
    this.results = []
    if (this.url == "anime") {
      for (let i = 0; i < this.pageSize; i++) {
        if (this.seasonAnimeData[i + this.pageSize * (this.pageNumber - 1)] != undefined) {
          this.results.push(this.seasonAnimeData[i + this.pageSize * (this.pageNumber - 1)])
        }
      }
    }
    else {
      for (let i = 0; i < this.pageSize; i++) {
        if (this.seasonAnimeData[i + this.pageSize * (this.pageNumber - 1)] != undefined) {
          this.results.push(this.seasonAnimeData[i + this.pageSize * (this.pageNumber - 1)])
        }
      }
    }

  }
  onSearchLetterChange(lt: string) {
    this.letter = lt

    this.pageNumber = 1
    this.isLoading = true
    if (this.url == "anime") {
      this.searchService.getSearchResultLetterAnime(this.letter, this.pageNumber).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }
    else {
      this.searchService.getSearchResultLetterManga(this.letter, this.pageNumber).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }

  }
  onSearchLetterPageChange() {
    this.isLoading = true
    if (this.url == "anime") {
      this.searchService.getSearchResultLetterAnime(this.letter, this.pageNumber).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }
    else {
      this.searchService.getSearchResultLetterManga(this.letter, this.pageNumber).subscribe(
        data => {
          this.results = data.results
          this.collectionSize = Number(data.last_page) * this.pageSize
          this.isLoading = false
        }
      )
    }

  }
  switchSite(u: string) {
    console.log(u)

  }

  onChange(value: any) {
    let u = value.target.value;
    this.setValue()
    if (u == "anime") {
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigateByUrl("/search/anime"))

    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigateByUrl("/search/manga"))
    }
  }
  scroll(el: HTMLParagraphElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
