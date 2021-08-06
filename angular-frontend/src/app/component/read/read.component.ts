import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private infoService: InfomationService, private route: ActivatedRoute, private router: Router,
  ) { }

  ngOnInit(): void {

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
}
