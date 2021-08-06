import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {
  @ViewChild('watch', { static: true }) contentPage!: ElementRef;
  anime: any
  anime_id: any
  episodes: any[] = []
  episodes_last_page: number = 1
  current_ep: number = 1
  current_ep_name: string = ""
  ep_page = 1
  video_url: any


  current_review_page=1
  mal_review:any[]=[]
  fb_review:any[]=[]

  random_url: string[] = [
    'https://www.youtube.com/embed/pHXDMe6QV-U?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/v1K4EAXe2oo?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/NQ_F1BtscWk?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/LElfACdKlxM?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/V3R9y5v8GUY?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/RkQ1cgvkylI?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/yBLdQ1a4-JI?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/3K3MMtoG8rY?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/QH2-TGUlwu4?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/PGNiXGX2nLU?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/Ukiq1g900aE?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/NUYvbT6vTPs?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0',
    'https://www.youtube.com/embed/LDU_Txk06tM?enablejsapi=1&wmode=opaque&autoplay=1&modestbranding=1&showinfo=0&rel=0']



  isLoading: boolean = false
  isLoadingComment:boolean=false
  isCollapsed: boolean[] = []
  noUpdate: boolean = false
  noTrailer: boolean = true
  constructor(private infoService: InfomationService, private route: ActivatedRoute, private router: Router,
    private renderer: Renderer2, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // console.log(this.router.url)
    // console.log(this.route.snapshot.paramMap.get("id"))
    // console.log(this.route.snapshot.paramMap.get("ep"))
    this.anime_id = this.route.snapshot.paramMap.get("id")
    this.isLoading = true
    this.getInfo()


  }
  getInfo() {
    setTimeout(() => {

      this.infoService.getAnime(this.anime_id).subscribe(
        data => {
          this.anime = data
          console.log(this.anime)

        }
      )
    }, 1050);
    setTimeout(() => {
      this.infoService.getAnimeEp(this.anime_id, this.ep_page).subscribe(
        data => {
          // console.log(data)
          this.episodes = data.episodes
          this.episodes_last_page = data.episodes_last_page
          // console.log(this.episodes)
          // console.log(this.episodes_last_page)
          for (let i = 0; i < this.episodes_last_page; i++) {
            this.isCollapsed.push(true)
          }
          if (this.episodes.length != 0) {
            this.switchEpTab(0)
            this.switchEp(1)
          }
          else {
            this.isLoading = false
            this.noUpdate = true
            this.noUpdateFunction()
          }

        }
      )
    }, 2050);

    this.infoService.getAnimeReviews(this.anime_id,this.current_review_page).subscribe(
      data=>{
        //console.log(data)
        this.mal_review=data.reviews
      }
    )

  }
  noUpdateFunction() {

    if (this.anime.trailer_url != null) {
      this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.anime.trailer_url)
      this.noTrailer = false
    }


  }

  switchEpTab(i: number) {
    let s = String(i)
    this.isLoading = true
    for (let j = 0; j < this.isCollapsed.length; j++) {
      this.isCollapsed[j] = false
    }
    this.isCollapsed[i] = !this.isCollapsed[i]
    this.infoService.getAnimeEp(this.anime_id, i + 1).subscribe(
      data => {
        this.episodes = data.episodes
        this.episodes_last_page = data.episodes_last_page
        this.isLoading = false
      }
    )

  }
  switchEp(id: number) {
    this.showUp()
    this.current_ep = id
    this.current_ep_name = this.episodes[this.current_ep - 1].title
    this.isLoading = true
    setTimeout(() => {
      if (this.anime.trailer_url != null) {
        this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.anime.trailer_url)
        this.noTrailer = false
      }
      else {
        let random = this.random_url[this.randomInteger(0, this.random_url.length - 1)]
        this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl(random)
      }
      this.isLoading = false

    }, 2050);

  }

  showUp() {
    this.contentPage.nativeElement.scrollIntoView();
  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  readMore(){
    this.current_review_page+=1
    this.isLoadingComment=true
    this.infoService.getAnimeReviews(this.anime_id,this.current_review_page).subscribe(
      data=>{
        data.reviews.forEach((element: any) => {
          this.mal_review.push(element)
        });
        this.isLoadingComment=false
      }
    )
  }
}
