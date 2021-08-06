import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-anime-info',
  templateUrl: './anime-info.component.html',
  styleUrls: ['./anime-info.component.css']
})
export class AnimeInfoComponent implements OnInit {

  anime_id:any
  anime:any
  trailer_url:any
  op:any[]=[]
  ed:any[]=[]
  op_view:boolean=true
  ed_view:boolean=true

  adaptation:any[]=[]
  sequel:any[]=[]
  side_story:any[]=[]
  other:any[]=[]
  summary:any[]=[]

  page = 1;
  pageSize = 4;
  collectionSize = 50;
  related:any[]=[];
  prequel:any[]=[]

  current_review_page=1
  mal_review:any[]=[]
  fb_review:any[]=[]

  isLoading:Boolean=false
  isLoadingComment:boolean=false
  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router,
    private infoServeice: InfomationService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.anime_id = Number(this.route.snapshot.paramMap.get("id"));
      this.getAnime()
    })
  }
  getAnime(){
    this.isLoading=true
    this.op_view=true
    this.ed_view=true
    this.infoServeice.getAnime(this.anime_id).subscribe(
      data=>{
        this.anime=data
       // console.log(this.anime)
        
        if(this.anime.trailer_url!=null){
          this.trailer_url=this.sanitizer.bypassSecurityTrustResourceUrl(this.anime.trailer_url)
        }
        else{
          this.trailer_url==null
        }
        this.op=this.anime.opening_themes
        this.ed=this.anime.ending_themes
        this.prequel=this.anime.related.Prequel
        this.adaptation=this.anime.related.Adaptation      
        this.sequel=this.anime.related.Sequel
        this.side_story=this.anime.related["Side story"]
        this.other=this.anime.related.Other
        this.summary=this.anime.related.Summary

        this.isLoading=false
      }
    )
    this.infoServeice.getAnimeReviews(this.anime_id,this.current_review_page).subscribe(
      data=>{
        //console.log(data)
        this.mal_review=data.reviews
      }
    )
  }
  checkRelatedLength():boolean{
    if(this.adaptation==undefined&&this.sequel==undefined&&this.side_story==undefined&&this.other==undefined&&this.prequel==undefined){
      return false
    }
    return true

  }

  readMore(){
    this.current_review_page+=1
    this.isLoadingComment=true
    this.infoServeice.getAnimeReviews(this.anime_id,this.current_review_page).subscribe(
      data=>{
        data.reviews.forEach((element: any) => {
          this.mal_review.push(element)
        });
        this.isLoadingComment=false
      }
    )
  }

}
