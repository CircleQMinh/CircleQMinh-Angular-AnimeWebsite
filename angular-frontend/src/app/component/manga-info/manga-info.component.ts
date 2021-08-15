import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map, timeout } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
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

  comment_rating!: number
  comment_content: string = ""
  isLogin: boolean = false
  email!: string
  uid!: string
  username!: string;
  isPosting:boolean=false

  isFav:boolean=false

  recom: any[] = []
  pageSizeManga = 7
  pageManga: number = 1
  mangaItem: any[] = []

  charList:any=[]
  charListMain:any[]=[]

  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router,private authService: AuthService,
    private infoServeice: InfomationService,private sanitizer: DomSanitizer, private toast: HotToastService) { }

  ngOnInit(): void {
    this.getLocalStorage()
    this.route.paramMap.subscribe(params => {
      this.charListMain=[]
      this.charList=[]
      this.isFav=false
      this.manga_id = Number(this.route.snapshot.paramMap.get("id"));
      this.getManga()
    })
  }
  getLocalStorage() {
    if(localStorage.getItem("isLogin")){
   
      let timeOut= new Date(localStorage.getItem("timeOut")!)
      let timeNow = new Date()
  
      if(timeOut.getTime()<timeNow.getTime()){
        //console.log("time out remove key")
        localStorage.removeItem("isLogin")
        localStorage.removeItem("uid")
        localStorage.removeItem("email")
        localStorage.removeItem("timeOut")
        localStorage.removeItem("username")
      }
      else{
        this.isLogin = Boolean(localStorage.getItem('isLogin'))
        this.uid = localStorage.getItem('uid')!
        this.email = localStorage.getItem("email")!
        this.username = localStorage.getItem("username")!
        this.authService.isLogin=this.isLogin
        this.authService.idLogin=this.uid
        this.authService.emailLogin=this.email
        this.authService.userLogin=this.username
        //console.log("still login")
      }
    }
    else{
     // console.log("no login acc")
    }

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
     // console.log(data)
      this.manga=data
      this.adaptation=this.manga.related.Adaptation      
        this.sequel=this.manga.related.Sequel
        this.prequel=this.manga.related.Prequel
        this.side_story=this.manga.related["Side story"]
        this.other=this.manga.related.Other
        this.isLoading=false
    })
    this.delay(1050)
    this.infoServeice.getMangaRecommendations(this.manga_id).pipe(timeout(10000)).subscribe(
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
    if(this.isLogin){
      this.authService.getUserFavManga(this.authService.idLogin).pipe(map(
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
        data=>{
          for(let i=0;i<data.length;i++){
            // console.log(data[i])
            if(data[i].manga_id==this.manga_id){
              // console.log("yes")
              this.isFav=true
              break
            }
          }
        },
        error=>{
          // console.log("no ")
          console.log(error)
        }
      )
    }
    this.delay(1050)
    this.infoServeice.getMangaChars(this.manga_id).pipe(timeout(10000)).subscribe(
      data=>{
        //console.log(data)
        this.charList=data.characters
        this.charList.forEach((element: any) => {
          if(element.role=="Main"){
            this.charListMain.push(element)
          }
        });
      },
      error=>{
        console.log(error)
      }
    )
    this.delay(1050)
    this.infoServeice.getMangaReviews(this.manga_id,this.current_review_page).pipe(timeout(10000)).subscribe(
      data=>{
        //console.log(data)
        this.mal_review=data.reviews
      }
    )
    this.getFBComment()
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
    this.infoServeice.getMangaFBReviews(this.manga_id).pipe(map(
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
  goToSearchGenre(genre: number) {
    this.searchService.searchMode = 1
    if (genre == null) {
      this.searchService.genre = String("")
    }
    else {
      this.searchService.genre = String(genre)
    }

    this.router.navigateByUrl("/search/manga")
  }
  addToFav(){
    if(this.isLogin){
      // console.log(this.anime_id)
      // console.log(this.anime.title)
      // console.log(this.anime.image_url)
      this.authService.addFavManga(this.authService.idLogin,this.manga_id,this.manga.image_url,this.manga.title).subscribe(
        data=>{

          this.toast.success("Manga added to favorite list!")
          this.isFav=true
        },
        error=>{
          this.toast.error("Something wrong!")
        }
      )
    }
    else{
      this.toast.show("Login to add this manga to your favorite list!")
    }

  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  next() {
    if(this.recom.length/this.pageSizeManga>this.pageManga){
      this.pageManga+=1
      this.getRecomPage()
    }
    
  }
  prev() {
    if(1<this.pageManga){
      this.pageManga-=1
      this.getRecomPage()
     
    }
  }

  getRecomPage() {
    //console.log(this.pageManga-1)
    this.mangaItem = []
   
    for (let i = 0; i < this.pageSizeManga; i++) {
      this.mangaItem.push(this.recom[i + this.pageSizeManga * (this.pageManga - 1)])
    }
   // console.log(this.mangaItem)
  }
  returnTotalPage():number{
    if(this.recom.length<this.pageSizeManga){
      return 1
    }
    else{
      return (this.recom.length/this.pageSizeManga)
    }
  }

  saveName(name:string){
    localStorage.setItem("manga_name",name);
  }
}