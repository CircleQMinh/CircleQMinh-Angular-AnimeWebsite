import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-manga-info',
  templateUrl: './manga-info.component.html',
  styleUrls: ['./manga-info.component.css']
})
export class MangaInfoComponent implements OnInit {


  // anime_id:any
  // anime:any
  // trailer_url:any
  // op:any[]=[]
  // ed:any[]=[]
  // op_view:boolean=true
  // ed_view:boolean=true

  adaptation:any[]=[]
  prequel:any[]=[]
  sequel:any[]=[]
  side_story:any[]=[]
  other:any[]=[]
  summary:any[]=[]

  // page = 1;
  // pageSize = 4;
  // collectionSize = 50;
  // related:any[]=[];

  manga:any
  manga_id:any
 
  
  current_review_page=1
  mal_review:any[]=[]
  fb_review:any[]=[]
  isLoadingComment:boolean=false
  isLoading:Boolean=false
  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router,
    private infoServeice: InfomationService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.manga_id = Number(this.route.snapshot.paramMap.get("id"));
      this.getManga()
    })
  }
  
  checkRelatedLength():boolean{
    if(this.adaptation==undefined&&this.sequel==undefined&&this.side_story==undefined&&this.other==undefined&&this.prequel==undefined){
      return false
    }
    return true

  }
  getManga(){
    this.isLoading=true
    this.infoServeice.getManga(this.manga_id).subscribe(data=>{
      console.log(data)
      this.manga=data
      this.adaptation=this.manga.related.Adaptation      
        this.sequel=this.manga.related.Sequel
        this.prequel=this.manga.related.Prequel
        this.side_story=this.manga.related["Side story"]
        this.other=this.manga.related.Other
        this.isLoading=false
    })
    this.infoServeice.getMangaReviews(this.manga_id,this.current_review_page).subscribe(
      data=>{
        //console.log(data)
        this.mal_review=data.reviews
      }
    )
  }
  readMore(){
    this.current_review_page+=1
    this.isLoadingComment=true
    this.infoServeice.getMangaReviews(this.manga_id,this.current_review_page).subscribe(
      data=>{
        data.reviews.forEach((element: any) => {
          this.mal_review.push(element)
        });
        this.isLoadingComment=false
      }
    )
  }

}