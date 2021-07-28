import { WeekDay } from '@angular/common';
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
  scheduleData:any[]=[]

  constructor(private infoService: InfomationService) { }

  ngOnInit(): void {
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

    this.newSoure.forEach(async element => {
      var response = await this.infoService.getAnimeNews(element).toPromise();
      if (response) {
        // console.log(response.articles);
        response.articles.forEach((a: any) => {
          this.dataNewpaper.push(a)
        });
      }
      this.pageNewpaperCount = this.dataNewpaper.length
      this.shuffleNew(this.dataNewpaper)
      this.getAnimeNewPage()
    });

    this.infoService.getAnimeByPopularity().subscribe(
      data => {
        this.dataBest = data.top
        this.getBest()
      },
      error => {
        console.log(error)
      }
    )
    // var t = new Date()
    // this.weekday = this.getWeekday(t.getDay())
    // this.infoService.getAnimeSchedule(this.weekday).subscribe(
    //   data => {
    //     switch (this.weekday) {

    //       case "sunday": {
    //         this.scheduleData=data.sunday
    //         break
    //       }
    //       case "monday": {
    //         this.scheduleData=data.monday
    //         break
    //       }
    //       case "tuesday": {
    //         this.scheduleData=data.tuesday
    //         break
    //       }
    //       case "wednesday": {
    //         this.scheduleData=data.wednesday
    //         break
    //       }
    //       case "thursday": {
    //         this.scheduleData=data.thursday
    //         break
    //       }
    //       case "friday": {
    //         this.scheduleData=data.friday
    //         break
    //       }
    //       case "saturday": {
    //         this.scheduleData=data.saturday
    //         break
    //       }

    //       default: {
    //         break
    //       }
    //     }
    //     console.log(this.scheduleData)
    //   },
    //   error => {
    //     console.log(error)
    //   }
    // )

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
    if (this.pageBest < 6) {
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
