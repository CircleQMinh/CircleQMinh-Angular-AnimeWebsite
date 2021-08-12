import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngneat/hot-toast';
import { timeout } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {
  @ViewChild('goUp', { static: true }) contentPage!: ElementRef;
  isLoading: boolean = false
  isLoadingTopChar:boolean=false
  showSearchResult: boolean = false
  mode = 1
  noResult: boolean = false
  searchResult: any[] = []
  last_page: number = 0
  current_page: number = 1
  keyword!: string

  topChar: any[] = []
  pageChar: number = 1
  pagaSizeChar = 50


  char_id: any = "73227"
  char: any
  about :any
  char_pic:any


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private infoService: InfomationService, private toast: HotToastService) { }

  ngOnInit(): void {

    this.getTopCharPage()
    //this.getRandomChar()
  }

  getRandomChar(){
    this.isLoading=true
    this.char_id=this.randomInteger(1,180000)
    //console.log(this.char_id)
    setTimeout(()=>{
      this.infoService.getCharacter(this.char_id).pipe(timeout(8000)).subscribe(
        data=>{
          this.char=data
          let s:string=this.char.about
          s.replace(/,/g, '\n')
          let a:any[]= s.split("\n")
          this.about=a
          this.getRandomCharPic()
          
        },
        error=>{
         // console.log(error)
          this.getRandomChar()
        }
      )
    },1000)
    
  }
  getRandomCharPic(){
    this.char_pic=[]
    this.infoService.getCharacterPic(this.char_id).pipe(timeout(15000)).subscribe(
      data=>{
        this.char_pic=data.pictures
        this.isLoading=false
      },
      error=>{
        this.isLoading=false
        this.getRandomCharPic()
       // console.log(error)
      }

    )
  }
  switchMode(m: number) {
    this.mode = m
    if(this.mode==2){
      this.getRandomChar()
    }
  }
  search() {
    if (this.keyword.length > 2) {
      this.isLoading = true
      this.showSearchResult = true
      this.noResult = false
      this.searchResult = []
      setTimeout(() => {

        this.infoService.getNavSearchResultChar(this.keyword, this.current_page).pipe(timeout(10000)).subscribe(
          data => {
            this.searchResult = data.results
            this.last_page = data.last_page
            // console.log(data)
            // console.log(this.searchResult)
            this.isLoading = false
          },
          error => {
            this.noResult = true
            this.isLoading = false
            console.log(error)
          }
        )

      }, 1050);
    }
    else {
      this.toast.error("We only processes search request with a minimum keyword length of 3 letters !")
    }

  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  prevSearchPage(){
    if(this.current_page>1){
      this.current_page-=1
      this.search()
    }

  }
  nextSearchPage(){
    if(this.current_page+1<=this.last_page){
      this.current_page+=1
      this.search()
    }
  }

  getTopCharPage() {
    this.isLoadingTopChar = true
    this.showSearchResult = false
    this.mode=1
    setTimeout(() => {

      this.infoService.getTopCharacterPage(this.pageChar).subscribe(
        data => {
          this.topChar=[]
          this.topChar = data.top
          this.isLoadingTopChar = false
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )

    }, 1500);
  }
  nextTopChar() {

    this.pageChar += 1
    this.getTopCharPage()

  }
  prevTopChar() {
    if (this.pageChar > 1) {
      this.pageChar -= 1
      this.getTopCharPage()
    }
  }
  returnTopCharDes(o:any):string{
    if(o.animeography.length>0){
      return o.title+'-'+o.name_kanji+' from '+o.animeography[0].name  
    }
    else if(o.mangaography.length>0){
      return o.title+'-'+o.name_kanji+' from '+o.mangaography[0].name  
    }
    else{
      return o.title+'-'+o.name_kanji
    }

  }






  images = ['https://wallpaperaccess.com/full/388782.jpg',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2c8d2ae9-b4c4-41d0-a6ba-0fb04f082d80/d8ersq2-496fa555-0f2a-4261-9b25-1d213f6674a3.png/v1/fill/w_1125,h_710,q_70,strp/anime_characters_wallpaper_by_pingoo246_d8ersq2-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAxMCIsInBhdGgiOiJcL2ZcLzJjOGQyYWU5LWI0YzQtNDFkMC1hNmJhLTBmYjA0ZjA4MmQ4MFwvZDhlcnNxMi00OTZmYTU1NS0wZjJhLTQyNjEtOWIyNS0xZDIxM2Y2Njc0YTMucG5nIiwid2lkdGgiOiI8PTE2MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ._SZxQyDupWD1T7MTTyFWtdo0YrhnMH-uO1h60MNcFbI',
    'https://wallpaperaccess.com/full/4355790.jpg'];

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


  scroll(el: HTMLParagraphElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
