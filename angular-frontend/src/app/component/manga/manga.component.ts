import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.component.html',
  styleUrls: ['./manga.component.css']
})
export class MangaComponent implements OnInit {
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

  weekday: string = ""
  scheduleData: any[] = []

  isLoading: boolean = true

  constructor(private infoService: InfomationService, private searchService: SearchService,private toast: HotToastService,
    private router: Router) { }

  ngOnInit(): void {

    // this.infoService.getMangaChapterLong().subscribe(
    //   data=>{
    //     console.log(data)
    //   }
    // )






    setTimeout(() => {
      this.infoService.getMangaNewest().subscribe(
        data => {
          this.dataNewest = data.results
          this.getNewest()
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )


    }, 1000);
    setTimeout(() => {
      this.infoService.getMangaTopRating().subscribe(
        data => {
          //console.log(data.top)
          this.dataUpComing = data.results
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
        this.delay(2050);
        if (response) {
          // console.log(response.articles);
          response.articles.forEach((a: any) => {
            this.dataNewpaper.push(a)
          });
        }
        else{
          this.toast.error("Failed to load data from API")
        }
        this.pageNewpaperCount = this.dataNewpaper.length
        this.shuffleNew(this.dataNewpaper)
        this.getAnimeNewPage()
      });


    }, 4200);
    setTimeout(() => {

      this.infoService.getMangaChapterLong().subscribe(
        data => {
          this.dataBest = data.results
          this.getBest()
          this.isLoading=false
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )
    

    }, 6500);


  }

  goToSearchGenre(genre: number) {
    this.searchService.searchMode = 1
    if (genre == null) {
      this.searchService.genre = String("")
    }
    else {
      this.searchService.genre = String(genre)
    }

    this.router.navigateByUrl("/search/manga")
  }
  goToSearchSeason() {
    this.searchService.searchMode = 2
    let today: Date = new Date()
    this.searchService.season = this.getCurrentSeason(today.getMonth())
    this.router.navigateByUrl("/search/manga")
  }
  goToSearchLetter() {
    this.searchService.searchMode = 3
    this.router.navigateByUrl("/search/manga")
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
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getNewest() {
    this.newestItem = []
    for (let i = 0; i < this.pageSizeNewest; i++) {
      this.newestItem.push(this.dataNewest[i + this.pageSizeNewest * (this.pageNewest-1)])
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
























  images = ['https://pbs.twimg.com/media/Ez5-TflXEAMcL-f?format=jpg&name=4096x4096',
    'https://pbs.twimg.com/media/EdESzeFWoAEPNPA.png',
    'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs2/169038941/original/bdceb666a2c7571a13b196c0169411fe6f40bafa/design-manga-style-banner-and-anime-icons-for-facebook-youtube-and-twitter.jpg'];

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