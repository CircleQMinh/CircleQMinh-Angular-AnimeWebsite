import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  manga: any
  manga_id: any
  current_chap:number=1
  current_server:number=1
  chapter_page:any[]=[]



  isLoading: boolean = false
  current_review_page=1
  mal_review:any[]=[]
  fb_review:any[]=[]
  isLoadingComment:boolean=false

  comment_rating!: number
  comment_content: string = ""
  isLogin: boolean = false
  username:string=""
  isPosting:boolean=false


  constructor(private infoService: InfomationService, private route: ActivatedRoute, private router: Router,
    private authService: AuthService,private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.isLogin = this.authService.isLogin
    this.username=this.authService.userLogin
    this.manga_id = this.route.snapshot.paramMap.get("id")
    //console.log(this.manga_id)
    this.getInfo()
  }
  getInfo() {
    this.isLoading=true
    setTimeout(() => {
      this.infoService.getMangaInfo(this.manga_id).subscribe(
        data=>{
          this.chapter_page=data.pictures
        }
      )
    }, 1050);
    setTimeout(() => {
      this.infoService.getManga(this.manga_id).subscribe(
        data => {
          
          this.manga=data
          this.isLoading=false
        }
      )
    }, 2050);
    this.infoService.getMangaReviews(this.manga_id,this.current_review_page).subscribe(
      data=>{
        //console.log(data)
        this.mal_review=data.reviews
      }
    )
      this.getFBComment()
  }

  onChapterChange(){
    this.isLoading=true
    setTimeout(() => {
      this.isLoading=false
    }, 3050);
  }
  readMore(){
    this.current_review_page+=1
    this.isLoadingComment=true
    this.infoService.getMangaReviews(this.manga_id,this.current_review_page).subscribe(
      data=>{
        data.reviews.forEach((element: any) => {
          this.mal_review.push(element)
        });
        this.isLoadingComment=false
      }
    )
  }
  postComment() {
    if (this.comment_rating && this.comment_content.trim().length != 0) {
      this.isPosting=true
      // console.log(this.comment_content)
      // console.log(this.comment_rating)
      // console.log(this.authService.userLogin)
      // console.log(formatDate(Date.now(), 'MMMM d, y, h:mm:ss a z', 'en'))
      this.authService.postMangaComment(this.manga_id, this.username, this.comment_content,
        this.comment_rating, formatDate(Date.now(), 'MMMM d, y, h:mm:ss a z', 'en')).subscribe(
          data => {
           // console.log(data)
            this.getFBComment()
            this.isPosting=false
            this.comment_content=""
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
    this.infoService.getMangaFBReviews(this.manga_id).pipe(map(
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
        this.fb_review=data

      },
      error => {
        console.log(error)
      }
    )
  }
}
