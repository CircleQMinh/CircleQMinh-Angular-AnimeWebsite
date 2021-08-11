import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
  constructor( private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private infoServeice: InfomationService,  private toast: HotToastService) { }

  ngOnInit(): void {
    this.char_id = Number(this.route.snapshot.paramMap.get("id"));
    //console.log(this.char_id)
    this.isLoading=true
    this.infoServeice.getCharacter(this.char_id).subscribe(
      data=>{
        this.char=data
        let s:string=this.char.about
        s.replace(/,/g, '\n')
        let a:any[]= s.split("\n")
        this.about=a
        this.isLoading=false
      },
      error=>{
        console.log(error)
      }
    )
    this.infoServeice.getCharacterPic(this.char_id).subscribe(
      data=>{
        this.char_pic=data.pictures
      },
      error=>{
        console.log(error)
      }

    )
  }

}