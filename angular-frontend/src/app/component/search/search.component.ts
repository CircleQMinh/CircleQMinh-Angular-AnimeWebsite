import { Component, OnInit } from '@angular/core';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  type:string=""
  genre:string=""
  status:string=""

  results:any[]=[]

  pageSize=20
  pageNumber=1
  


  constructor(private searchService:SearchService,
              private infoServeice:InfomationService) { }

  ngOnInit(): void {
      this.infoServeice.getAnimeByYearAndSeason("2021","summer").subscribe(
        data=>{
          this.results=data.anime
        }
      )
  }

}
