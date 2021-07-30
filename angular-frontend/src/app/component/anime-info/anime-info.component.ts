import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-anime-info',
  templateUrl: './anime-info.component.html',
  styleUrls: ['./anime-info.component.css']
})
export class AnimeInfoComponent implements OnInit {

  anime_id:any
  anime:any

  isLoading:Boolean=false
  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router,
    private infoServeice: InfomationService) { }

  ngOnInit(): void {
    this.getAnime()
  }
  getAnime(){
    this.isLoading=true
    this.anime_id=this.route.snapshot.paramMap.get("id");
    this.infoServeice.getAnime(this.anime_id).subscribe(
      data=>{
        this.anime=data
        console.log(this.anime)
        this.isLoading=false
      }
    )
  }


}
