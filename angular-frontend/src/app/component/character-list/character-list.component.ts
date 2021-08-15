import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { timeout } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  url: any
  id: any
  name:any
  isLoading: boolean = false
  charList:any[]=[]
  charListMain:any[]=[]
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private infoService: InfomationService, private toast: HotToastService) { }

  ngOnInit(): void {
    let a = this.router.url
    if (a.includes("anime")) {
      this.url = "anime"
    }
    else {
      this.url = "manga"
    }
    this.id= this.route.snapshot.paramMap.get("id")
    this.isLoading=true
    this.getCharList()
  }

  getCharList() {
    if (this.url == "anime") {
      
      this.getAnimeCharList()
    }
    else {
      this.getMangaCharList()
    }
  }
  getAnimeCharList() {
    this.name=localStorage.getItem("anime_name")
    this.infoService.getAnimeChars(this.id).pipe(timeout(10000)).subscribe(
      data=>{
        this.charList=data.characters
        for(let i=0;i<this.charList.length;i++){
          if(this.charList[i].role=="Main"){
            this.charListMain.push(this.charList[i])
            this.charList.splice(i,1)
            i-=1
          }
        }
        this.isLoading=false
      },
      error=>{
        console.log(error)
        this.toast.error("Failed to load data from API")
      }
    )
  }
  getMangaCharList() {
    this.name=localStorage.getItem("manga_name")
    this.infoService.getMangaChars(this.id).pipe(timeout(10000)).subscribe(
      data=>{
        this.charList=data.characters
        for(let i=0;i<this.charList.length;i++){
          if(this.charList[i].role=="Main"){
            this.charListMain.push(this.charList[i])
            this.charList.splice(i,1)
            i-=1
          }
        }
        this.isLoading=false
      },
      error=>{
        console.log(error)
        this.toast.error("Failed to load data from API")
      }
    )
  }

}
