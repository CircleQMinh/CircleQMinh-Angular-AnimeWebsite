import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user_id:any="AXVhLNBiUnWEXvE40C3gdcINyyf1"
  user_email:any=""
  username:any=""
  isLogin:boolean=false
  isLoading:boolean=false

  favorite_anime:any[]=[]
  pageSizeAnime = 7
  pageAnime: number = 1
  animeItem: any[] = []

  favorite_manga:any[]=[]
  pageSizeManga = 7
  pageManga: number = 1
  mangaItem: any[] = []

  test:any[]=[{id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"},
  {anime_id:44511,anime:"Chainsaw Man",url:"https://cdn.myanimelist.net/images/anime/1632/110707.jpg"}]

  constructor(private infoService: InfomationService, private route: ActivatedRoute, private router: Router,
    private authService: AuthService,private toast: HotToastService) { }

  ngOnInit(): void {
   
    this.isLogin=this.authService.isLogin
    this.isLoading=true
    if(this.isLogin){
      this.user_id=this.route.snapshot.paramMap.get("id")
      this.getUserInfo()
      this.getFavoriteAnime()
      this.getFavoriteManga()
      this.isLoading=false
    }
    else{
      this.router.navigateByUrl("/login")
    }
    

  }

  getUserInfo(){
    this.isLoading=true
    this.authService.getUserInfo(this.user_id).pipe(map(
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
        let a=data.pop()
        this.username=a.username
        this.user_email=a.email
      }
    )
  }

  getFavoriteAnime(){
    this.authService.getUserFavAnime(this.user_id).pipe(map(
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
        this.favorite_anime=data
        this.getFavAnimePage()
      },
      error=>{
        console.log(error)
      }
    )
    
  }

  getFavAnimePage() {
    this.animeItem = []
    for (let i = 0; i < this.pageSizeAnime; i++) {
      this.animeItem.push(this.favorite_anime[i + this.pageSizeAnime * (this.pageAnime-1)])
    }
  }
  nextAnimePage() {
    if(this.favorite_anime.length/this.pageSizeAnime>this.pageAnime){
      this.pageAnime+=1
      this.getFavAnimePage()
    }
    
  }
  prevAnimePage() {
    if(1<this.pageAnime){
      this.pageAnime-=1
      this.getFavAnimePage()
     
    }
  }

  getFavoriteManga(){
    this.authService.getUserFavManga(this.user_id).pipe(map(
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
        this.favorite_manga=data
        this.getFavMangaPage()
      },
      error=>{
        console.log(error)
      }
    )
    
  }
  getFavMangaPage() {
    this.mangaItem = []
    for (let i = 0; i < this.pageSizeManga; i++) {
      this.mangaItem.push(this.favorite_manga[i + this.pageSizeManga * (this.pageManga-1)])
    }
  }
  nextMangaPage() {
    if(this.favorite_manga.length/this.pageSizeManga>this.pageManga){
      this.pageManga+=1
      this.getFavMangaPage()
    }
    
  }
  prevMangaPage() {
    if(1<this.pageManga){
      this.pageManga-=1
      this.getFavMangaPage()
     
    }
  }
  signOut(){
    this.authService.isLogin=false
    this.isLogin=false
    let a = this.router.url
    this.router.navigateByUrl('/', { skipLocationChange: true })
    .then(() => this.router.navigateByUrl(a))
  }
}
