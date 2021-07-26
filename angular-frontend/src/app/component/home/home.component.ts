import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data:any[]=[]
  pageSize=12

  pageNewest:number=0
  newestCol:number=0
  newestItem:any[]=[]
  constructor(private infoService:InfomationService) { }

  ngOnInit(): void {
    this.infoService.getAnimeByYearAndSeason("2021","summer").subscribe(
      data=>{
        console.log(data.anime)
        this.data=data.anime
        this.getNewest()
      },
      error=>{
        console.log(error)
      }
    )
  }
  getNewest(){
    this.newestItem=[]
    for(let i=0;i<this.pageSize;i++){
      this.newestItem.push(this.data[i+this.pageSize*this.pageNewest])
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
