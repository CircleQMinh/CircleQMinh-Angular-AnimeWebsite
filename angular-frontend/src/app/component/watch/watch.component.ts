import { formatDate } from '@angular/common';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
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


  current_review_page = 1
  mal_review: any[] = []
  fb_review: any[] = []

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
  isLoadingComment: boolean = false
  isCollapsed: boolean[] = []
  noUpdate: boolean = false
  noTrailer: boolean = true

  comment_rating!: number
  comment_content: string = ""
  isLogin: boolean = false
  email!: string
  uid!: string
  username!: string;
  isPosting: boolean = false

  constructor(private infoService: InfomationService, private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private renderer: Renderer2, private sanitizer: DomSanitizer, private toast: HotToastService) { }

  ngOnInit(): void {
    // console.log(this.router.url)
    // console.log(this.route.snapshot.paramMap.get("id"))
    // console.log(this.route.snapshot.paramMap.get("ep"))
    this.getLocalStorage()
    this.anime_id = this.route.snapshot.paramMap.get("id")
    this.isLoading = true
    this.getInfo()


  }
  getLocalStorage() {
    if (localStorage.getItem("isLogin")) {

      let timeOut = new Date(localStorage.getItem("timeOut")!)
      let timeNow = new Date()

      if (timeOut.getTime() < timeNow.getTime()) {
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("uid")
        localStorage.removeItem("email")
        localStorage.removeItem("timeOut")
        localStorage.removeItem("username")
      }
      else {
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.uid = localStorage.getItem('uid')!
        this.email = localStorage.getItem("email")!
        this.username = localStorage.getItem("username")!
        this.authService.isLogin = this.isLogin
        this.authService.idLogin = this.uid
        this.authService.emailLogin = this.email
        this.authService.userLogin = this.username
        //console.log("still login")
      }
    }
    else {
      // console.log("no login acc")
    }

  }
  getInfo() {
    setTimeout(() => {

      this.infoService.getAnime(this.anime_id).subscribe(
        data => {
          this.anime = data
          // console.log(this.anime)

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

    this.infoService.getAnimeReviews(this.anime_id, this.current_review_page).subscribe(
      data => {
        //console.log(data)
        this.mal_review = data.reviews
      }
    )
    this.getFBComment()
    setTimeout(() => {
      this.infoService.getAnimeVideos(this.anime_id).subscribe(
        data => {
          console.log(data.promo)
          let a: any[] = data.promo
          if (a.length > 0) {
            this.random_url = []
            for (let i = 0; i < a.length; i++) {
              this.random_url.push(a[i].video_url)
            }
          }

        },
        error => {
          console.log(error)
        }
      )
    }, 2050);
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

  readMore() {
    this.current_review_page += 1
    this.isLoadingComment = true
    this.infoService.getAnimeReviews(this.anime_id, this.current_review_page).subscribe(
      data => {
        data.reviews.forEach((element: any) => {
          this.mal_review.push(element)
        });
        this.isLoadingComment = false
      }
    )
  }

  postComment() {
    if (this.comment_rating && this.comment_content.trim().length != 0) {
      this.isPosting = true
      // console.log(this.comment_content)
      // console.log(this.comment_rating)
      // console.log(this.authService.userLogin)
      // console.log(formatDate(Date.now(), 'MMMM d, y, h:mm:ss a z', 'en'))
      this.authService.postAnimeComment(this.anime_id, this.username, this.comment_content,
        this.comment_rating, formatDate(Date.now(), 'MMMM d, y, h:mm:ss a z', 'en')).subscribe(
          data => {
            // console.log(data)
            this.getFBComment()
            this.isPosting = false
            this.comment_content = ""
          },
          error => {
            console.log(error)
          }
        )
    }
    else {
      this.toast.warning("Content of comment is missing!")
    }
  }
  getFBComment() {
    this.infoService.getAnimeFBReviews(this.anime_id).pipe(map(
      data => {
        const postsArray = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            postsArray.push({ ...data[key], id: key });
          }
        }

        return postsArray.reverse();
      }
    )).subscribe(
      data => {
        //console.log(data)
        this.fb_review = data

      },
      error => {
        console.log(error)
      }
    )
  }
}
