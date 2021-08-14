import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { InfomationService } from 'src/app/service/infomation.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  isLogin:boolean=false
  email!: string
  uid!: string
  username!: string;
  message:string=""

  chatMess:any[]=[]

  showChatBox=true


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private infoService: InfomationService,  private toast: HotToastService) { }

  ngOnInit(): void {
    this.getLocalStorage()
    this.showHideChat()
    this.getChat()
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
  scrollToBottom() {

    let a=document.getElementById("chat_content")
    if(a){
      a.scrollTop=a.scrollHeight
     // console.log("aa")
    }
    else{
     // console.log("bb")
    }
 
  }
  showHideChat(){
    this.showChatBox=!this.showChatBox
    if(this.showChatBox==true){
      setTimeout(()=>{
        this.scrollToBottom()
      },10)
  
    }
  }

  postChat(){
    if(this.message.trim().length==0){

    }
    else{
      setTimeout(()=>{
        this.authService.addChatMess(this.username,formatDate(Date.now(), 'MMMM d, y, h:mm:ss a z', 'en'),this.message).subscribe(
          data=>{
  
          },
          error=>{
            this.toast.warning("Try again!")
          }
        )
        this.message=""
      },1000)

    }

  }
  getChat(){
    
    setInterval(()=>{
     this.authService.getChatMess().pipe(map(
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
        this.chatMess=data
        this.chatMess.reverse()
        //console.log(this.chatMess)

      },
      error => {
        console.log(error)
      }
    )


    },2000)
  }
}
