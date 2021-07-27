import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { InfomationService } from 'src/app/service/infomation.service';

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
  newSoure: any[] = [44511, 38000, 37999, 1, 2]
  newItems: any[] = []
  pageNewpaper = 0
  pageNewpaperCount = 0
  pageNewPaperSize = 4

  constructor(private infoService: InfomationService) { }

  async ngOnInit(): Promise<void> {
    this.infoService.getAnimeByYearAndSeason("2021", "summer").subscribe(
      data => {
        this.dataNewest = data.anime
        this.getNewest()
      },
      error => {
        console.log(error)
      }
    )
    this.infoService.getTopUpCommingAnime().subscribe(
      data => {
        //console.log(data.top)
        this.dataUpComing = data.top
        this.getUpComing()
      },
      error => {
        console.log(error)
      }
    )
    this.newSoure.forEach(element => {
      this.getAnimeNew(element)
      console.log(element)
      console.log(this.dataNewpaper)
      this.getAnimeNewPage()
      console.log(this.newItems)
    });

  }
  getNewest() {
    this.newestItem = []
    for (let i = 0; i < this.pageSizeNewest; i++) {
      this.newestItem.push(this.dataNewest[i + this.pageSizeNewest * this.pageNewest])
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
    if (this.pageUpComing < 6) {
      this.pageUpComing += 1
      this.getUpComing()
    }
  }
  async getAnimeNew(num: number) {
    this.infoService.getAnimeNews(num).subscribe(
      data => {
        let a: any[] = []
        a = data.articles
        a.forEach(element => {
          this.dataNewpaper.push(element)
        });
      },
      error => {
        console.log(error)
      }
    )
  }

  getAnimeNewPage() {
    this.newItems = []
    for (let i = 0; i < this.pageNewPaperSize; i++) {
      this.newItems.push(this.dataNewpaper[i + this.pageNewPaperSize * this.pageNewpaper])
    }
  }

  debug() {
    console.log("newItems")
    console.log(this.newItems)
    console.log("dataNewPapaer")
    console.log(this.dataNewpaper)
    this.getAnimeNewPage()
  }



























  images = ['https://pbs.twimg.com/media/EV4xVijWoAASlxY.jpg',
    'https://zingtv-photo.zadn.vn/tv/1/8/7/2/1872a312fb96c74eb24241b22ad30b18.jpg',
    'https://www.mooreschools.com/cms/lib/OK01000367/Centricity/Domain/5471/Anime%20Banner.png'];

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
