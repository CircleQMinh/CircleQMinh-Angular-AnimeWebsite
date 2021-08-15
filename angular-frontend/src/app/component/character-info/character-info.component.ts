import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map, timeout } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-character-info',
  templateUrl: './character-info.component.html',
  styleUrls: ['./character-info.component.css']
})
export class CharacterInfoComponent implements OnInit {
  char_id: any
  char: any
  char_pic:any
  about:any
  isLoading:boolean=false
  isLogin:boolean=false
  isFav:boolean=false
  email!: string
  uid!: string
  username!: string;
  constructor( private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private infoServeice: InfomationService,  private toast: HotToastService) { }

  ngOnInit(): void {
    this.char_id = Number(this.route.snapshot.paramMap.get("id"));
    //console.log(this.char_id)
    this.getLocalStorage()
    this.getChar()
    if (this.isLogin) {
      this.authService.getUserFavCharacter(this.authService.idLogin).pipe(map(
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
            if (data[i].char_id == this.char_id) {
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
  getChar(){
    this.isLoading=true
    this.infoServeice.getCharacter(this.char_id).pipe(timeout(25000)).subscribe(
      data=>{
        this.char=data
        //console.log(this.char)
        let s:string=this.char.about
        s.replace(/,/g, '\n')
        let a:any[]= s.split("\n")
        this.about=a
        this.getPic()
      },
      error=>{
        //console.log(error)
        this.getChar()
      }
    )
  }
  getPic(){
    this.infoServeice.getCharacterPic(this.char_id).pipe(timeout(5000)).subscribe(
      data=>{
        this.char_pic=data.pictures
        this.isLoading=false
      },
      error=>{
       // console.log(error)
        this.isLoading=false
      }

    )
  }
  addToFav(){
    if (this.isLogin) {
      // console.log(this.anime_id)
      // console.log(this.anime.title)
      // console.log(this.anime.image_url)
      this.authService.addFavCharacter(this.authService.idLogin, this.char_id, this.char.image_url, this.char.name).subscribe(
        data => {

          this.toast.success("Character added to favorite list!")
          this.isFav = true
        },
        error => {
          this.toast.error("Something wrong!")
        }
      )
    }
    else {
      this.toast.show("Login to add this character to your favorite list!")
    }
  }

}