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

  email!: string
  uid!: string
  username!: string;
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

  favorite_char:any[]=[]
  pageSizeChar = 7
  pageChar: number = 1
  charItem: any[] = []

  mode=1

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
    this.getLocalStorage()
    this.isLoading=true
    if(this.isLogin){  
     // this.getUserInfo()
      this.getFavoriteAnime()
      this.getFavoriteManga()
      this.getFavoriteChar()
      this.isLoading=false
    }
    else{
      this.router.navigateByUrl("/login")
    }
    

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
  getUserInfo(){
    this.isLoading=true
    this.authService.getUserInfo(this.uid).pipe(map(
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
        this.email=a.email
      }
    )
  }

  getFavoriteAnime(){
    this.authService.getUserFavAnime(this.uid).pipe(map(
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
    this.authService.getUserFavManga(this.uid).pipe(map(
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
  getFavoriteChar(){
    this.authService.getUserFavCharacter(this.uid).pipe(map(
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
        this.favorite_char=data
        this.getFavCharPage()
      },
      error=>{
        console.log(error)
      }
    )
    
  }
  getFavCharPage() {
    this.charItem = []
    for (let i = 0; i < this.pageSizeChar; i++) {
      this.charItem.push(this.favorite_char[i + this.pageSizeChar * (this.pageChar-1)])
    }
  }
  nextCharPage() {
    if(this.favorite_char.length/this.pageSizeChar>this.pageChar){
      this.pageChar+=1
      this.getFavCharPage()
    }
    
  }
  prevCharPage() {
    if(1<this.pageChar){
      this.pageChar-=1
      this.getFavCharPage()
     
    }
  }
  signOut() {
    this.authService.isLogin = false
    this.isLogin = false
    let a = this.router.url
    console.log(a)

    localStorage.removeItem("isLogin")
    localStorage.removeItem("uid")
    localStorage.removeItem("email")
    localStorage.removeItem("timeOut")
    localStorage.removeItem("username")


    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigateByUrl(a))
  }
  returnTotalPageAnime():number{
    if(this.favorite_anime.length<this.pageSizeAnime){
      return 1
    }
    else{
      //console.log(this.favorite_anime.length/this.pageSizeAnime)
      return (this.favorite_anime.length/this.pageSizeAnime)+1
    }
  }
  returnTotalPageManga():number{
    if(this.favorite_manga.length<this.pageSizeManga){
      return 1
    }
    else{
      //console.log(this.favorite_manga.length/this.pageSizeManga)
      return (this.favorite_manga.length/this.pageSizeManga)+1
    }
  }
  returnTotalPageChar():number{
    if(this.favorite_char.length<this.pageSizeChar){
      return 1
    }
    else{
      //console.log(this.favorite_manga.length/this.pageSizeManga)
      return (this.favorite_char.length/this.pageSizeChar)+1
    }
  }

  switchMode(i:number){
    this.mode=i
  }
}
