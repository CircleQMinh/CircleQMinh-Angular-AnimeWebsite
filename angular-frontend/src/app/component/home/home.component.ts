import { WeekDay } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { delay } from 'rxjs/operators';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataNewest: any[] = []
  pageSizeNewest = 12
  pageNewest: number = 0
  newestCount: number = 0
  newestItem: any[] = []

  dataUpComing: any[] = []
  upComingItem: any[] = []
  pageUpComing: number = 0
  pageSizeUpComing = 7

  dataNewpaper: any[] = []
  newSoure: any[] = [44511, 38000, 37999, 1, 918]
  newItems: any[] = []
  pageNewpaper = 0
  pageNewpaperCount = 0
  pageNewPaperSize = 5

  dataBest: any[] = []
  bestItems: any[] = []
  pageBest: number = 0
  pageSizeBest = 10

  topChar: any[] = []
  topCharItem: any[] = []
  pageChar: number = 0
  pagaSizeChar = 12


  weekday: string = ""
  scheduleData: any[] = []

  isLoading: boolean = true


  constructor(private infoService: InfomationService, private searchService: SearchService, private toast: HotToastService,
    private router: Router) { }

  ngOnInit(): void {


    setTimeout(() => {
      this.infoService.getAnimeByYearAndSeason("2021", "summer").subscribe(
        data => {
          this.dataNewest = data.anime
          this.getNewest()
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )


    }, 1000);
    setTimeout(() => {
      this.infoService.getTopUpCommingAnime().subscribe(
        data => {
          //console.log(data.top)
          this.dataUpComing = data.top
          this.getUpComing()
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )


    }, 3050);
    setTimeout(() => {
      this.newSoure.forEach(async element => {
        var response = await this.infoService.getAnimeNews(element).toPromise();
        delay(2050);
        if (response) {
          // console.log(response.articles);
          response.articles.forEach((a: any) => {
            this.dataNewpaper.push(a)
          });
        }
        else {
          this.toast.error("Failed to load data from API")
        }
        this.pageNewpaperCount = this.dataNewpaper.length
        this.shuffleNew(this.dataNewpaper)
        this.getAnimeNewPage()
      });


    }, 4200);
    setTimeout(() => {

      this.infoService.getTopCharacter().subscribe(
        data => {
          this.topChar = data.top
         // console.log(this.topChar)
          this.getCharPage()
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )

    }, 6500);
    setTimeout(() => {

      this.infoService.getAnimeByPopularity().subscribe(
        data => {
          this.dataBest = data.top
          this.getBest()
          this.isLoading = false
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )

    }, 7800);

  }

  goToSearchGenre(genre: number) {
    this.searchService.searchMode = 1
    if (genre == null) {
      this.searchService.genre = String("")
    }
    else {
      this.searchService.genre = String(genre)
    }

    this.router.navigateByUrl("/search")
  }
  goToSearchSeason() {
    this.searchService.searchMode = 2
    let today: Date = new Date()
    this.searchService.season = this.getCurrentSeason(today.getMonth())
    this.router.navigateByUrl("/search")
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


  getNewest() {
    this.newestItem = []
    for (let i = 0; i < this.pageSizeNewest; i++) {
      this.newestItem.push(this.dataNewest[i + this.pageSizeNewest * (this.pageNewest - 1)])
    }
  }
  getUpComing() {
    this.upComingItem = []
    for (let i = 0; i < this.pageSizeUpComing; i++) {
      this.upComingItem.push(this.dataUpComing[i + this.pageSizeUpComing * this.pageUpComing])
    }
  }

  prevUpComing() {
    if (this.pageUpComing > 0) {
      this.pageUpComing -= 1
      this.getUpComing()
    }
  }

  nextUpComing() {
    if (this.pageUpComing < 5) {
      this.pageUpComing += 1
      this.getUpComing()
    }
  }
  getBest() {
    this.bestItems = []
    for (let i = 0; i < this.pageSizeBest; i++) {
      this.bestItems.push(this.dataBest[i + this.pageSizeBest * this.pageBest])
    }
  }
  prevBest() {
    if (this.pageBest > 0) {
      this.pageBest -= 1
      this.getBest()
    }
  }

  nextBest() {
    if (this.pageBest < 4) {
      this.pageBest += 1
      this.getBest()
    }
  }
  getAnimeNewPage() {
    this.newItems = []
    for (let i = 0; i < this.pageNewPaperSize; i++) {
      this.newItems.push(this.dataNewpaper[i + this.pageNewPaperSize * this.pageNewpaper])
    }
  }

  shuffleNew(array: any[]): any[] {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  getWeekday(num: number): string {
    switch (num) {

      case 0: {
        return "sunday"

      }
      case 1: {
        return "monday"
      }
      case 2: {
        return "tuesday"
      }
      case 3: {
        return "wednesday"
      }
      case 4: {
        return "thursday"
      }
      case 5: {
        return "friday"
      }
      case 6: {
        return "saturday"
      }

      default: {
        return ""
      }
    }

  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getCharPage() {
    this.topCharItem = []
    for (let i = 0; i < this.pagaSizeChar; i++) {
      this.topCharItem.push(this.topChar[i + this.pagaSizeChar * this.pageChar])
    }
  }
  nextTopChar(){
    if (this.pageChar < 4) {
      this.pageChar += 1
      this.getCharPage()
    }
  }
  prevTopChar() {
    if (this.pageChar > 0) {
      this.pageChar -= 1
      this.getCharPage()
    }
  }


















  images = ['https://pbs.twimg.com/media/EV4xVijWoAASlxY.jpg',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/93219448-4662-47cb-b585-be7672a62984/de7hrdt-7d75b97d-698d-47d1-879f-c4b8830bb1e4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkzMjE5NDQ4LTQ2NjItNDdjYi1iNTg1LWJlNzY3MmE2Mjk4NFwvZGU3aHJkdC03ZDc1Yjk3ZC02OThkLTQ3ZDEtODc5Zi1jNGI4ODMwYmIxZTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Xa9_HW3ctkYwD1TZfxlHzSOwezeksLlHrLhH5OvK3Ag',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/251056102702857.601d68afa19fb.png'];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  @ViewChild('carousel', { static: true })
  carousel!: NgbCarousel;
  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

}
