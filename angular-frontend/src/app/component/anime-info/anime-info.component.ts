import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/service/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-anime-info',
  templateUrl: './anime-info.component.html',
  styleUrls: ['./anime-info.component.css']
})
export class AnimeInfoComponent implements OnInit {

  anime_id: any
  anime: any
  trailer_url: any
  op: any[] = []
  ed: any[] = []
  op_view: boolean = true
  ed_view: boolean = true

  adaptation: any[] = []
  sequel: any[] = []
  side_story: any[] = []
  other: any[] = []
  summary: any[] = []

  page = 1;
  pageSize = 4;
  collectionSize = 50;
  related: any[] = [];
  prequel: any[] = []

  current_review_page = 1
  mal_review: any[] = []
  fb_review: any[] = []

  isLoading: Boolean = false
  isLoadingComment: boolean = false

  comment_rating!: number
  comment_content: string = ""
  isLogin: boolean = false
  username: string = ""
  isPosting: boolean = false

  isFav: boolean = false

  recom: any[] = []
  pageSizeAnime = 7
  pageAnime: number = 1
  animeItem: any[] = []



  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private infoServeice: InfomationService, private sanitizer: DomSanitizer, private toast: HotToastService) { }

  ngOnInit(): void {
    this.isLogin = this.authService.isLogin
    this.username = this.authService.userLogin

    this.route.paramMap.subscribe(params => {
      this.trailer_url=""
      this.pageAnime=1
      this.anime_id = Number(this.route.snapshot.paramMap.get("id"));
      this.getAnime()
    })
  }
  getAnime() {
    this.isLoading = true
    this.op_view = true
    this.ed_view = true
    this.infoServeice.getAnime(this.anime_id).subscribe(
      data => {
        this.anime = data
      //  console.log(this.anime)

        if (this.anime.trailer_url != null) {
          this.trailer_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.anime.trailer_url)
        }
        else {
          this.trailer_url == null
        }
        this.op = this.anime.opening_themes
        this.ed = this.anime.ending_themes
        this.prequel = this.anime.related.Prequel
        this.adaptation = this.anime.related.Adaptation
        this.sequel = this.anime.related.Sequel
        this.side_story = this.anime.related["Side story"]
        this.other = this.anime.related.Other
        this.summary = this.anime.related.Summary

        this.isLoading = false
      }
    )

    this.delay(1050)
    this.infoServeice.getAnimeRecommendations(this.anime_id).subscribe(
      data => {
        //console.log(data)
        this.recom = data.recommendations
        this.getRecomPage()
      },
      error => {
        console.log(error)
        this.toast.error("Failed to load data from API")
      }
    )
    this.delay(1050)


    if (this.isLogin) {
      this.authService.getUserFavAnime(this.authService.idLogin).pipe(map(
        data => {
          const postsArray = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              postsArray.push({ ...data[key], id: key });
            }
          }
          return postsArray;
        }
      )).subscribe(
        data => {
          for (let i = 0; i < data.length; i++) {
            // console.log(data[i])
            if (data[i].anime_id == this.anime_id) {
              // console.log("yes")
              this.isFav = true
              break
            }
          }
        },
        error => {
          // console.log("no ")
          console.log(error)
        }
      )
    }

    this.infoServeice.getAnimeReviews(this.anime_id, this.current_review_page).subscribe(
      data => {
        //console.log(data)
        this.mal_review = data.reviews

      }
    )
    this.getFBComment()
  }
  checkRelatedLength(): boolean {
    if (this.adaptation == undefined && this.sequel == undefined && this.side_story == undefined && this.other == undefined && this.prequel == undefined) {
      return false
    }
    return true

  }

  readMore() {
    this.current_review_page += 1
    this.isLoadingComment = true
    this.infoServeice.getAnimeReviews(this.anime_id, this.current_review_page).subscribe(
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
    this.infoServeice.getAnimeFBReviews(this.anime_id).pipe(map(
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

  addToFav() {
    if (this.isLogin) {
      // console.log(this.anime_id)
      // console.log(this.anime.title)
      // console.log(this.anime.image_url)
      this.authService.addFavAnime(this.authService.idLogin, this.anime_id, this.anime.image_url, this.anime.title).subscribe(
        data => {

          this.toast.success("Anime added to favorite list!")
          this.isFav = true
        },
        error => {
          this.toast.error("Something wrong!")
        }
      )
    }
    else {
      this.toast.show("Login to add this anime to your favorite list!")
    }

  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  next() {
    if(this.recom.length/this.pageSizeAnime>this.pageAnime){
      this.pageAnime+=1
      this.getRecomPage()
    }
    
  }
  prev() {
    if(1<this.pageAnime){
      this.pageAnime-=1
      this.getRecomPage()
     
    }
  }

  getRecomPage() {
    //console.log(this.pageAnime-1)
    this.animeItem = []
    for (let i = 0; i < this.pageSizeAnime; i++) {
      this.animeItem.push(this.recom[i + this.pageSizeAnime * (this.pageAnime - 1)])
    }
  }
}
