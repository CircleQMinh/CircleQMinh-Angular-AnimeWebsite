import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { InfomationService } from 'src/app/service/infomation.service';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  constructor(private infoService: InfomationService, private searchService: SearchService, private toast: HotToastService,
    private router: Router) { }
  weekday: string[] = []
  dayOfChoice!: number
  nameDayOfChoice!: string
  scheduleData: any[] = []
  isLoading: boolean = false
  @ViewChild('chat_content')
  content!: ElementRef;
  ngOnInit(): void {

    this.weekday = this.startAndEndOfWeek()
    // console.log(this.weekday)
    // console.log(this.dayOfChoice)
    // console.log(this.nameDayOfChoice)
    this.isLoading = true
    setTimeout(() => {
      this.infoService.getAnimeSchedule(this.nameDayOfChoice).subscribe(
        data => {
          this.scheduleData = data[`${this.nameDayOfChoice}`]
          // console.log(this.scheduleData)
          this.isLoading = false
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )


    }, 1000);

  }


  startAndEndOfWeek() { //monday-->sunday[0-6]
    var now = new Date();//sunday-->sat[0-6]
    this.dayOfChoice = this.getDayOfChoice(now.getDay())//monday-->sun[0-6]
    this.nameDayOfChoice = this.getNameOfWeekday(now.getDay())
    now.setHours(0, 0, 0, 0);
    return Array(7).fill('').map((_, i) => {
      var monday = new Date(now);
      monday.setDate(monday.getDate() - monday.getDay() + (i + 1));
      const day = monday.toDateString().split(' ')[0];
      const month = monday.getMonth() + 1;
      const date = monday.getDate();
      return day + ' ' + date + '/' + month;
    });
  }

  navChange(day: number) {
    switch (day) {
      case 0: {
        this.nameDayOfChoice = "monday"
        break
      }
      case 1: {
        this.nameDayOfChoice = "tuesday"
        break
      }
      case 2: {
        this.nameDayOfChoice = "wednesday"
        break
      }
      case 3: {
        this.nameDayOfChoice = "thursday"
        break
      }
      case 4: {
        this.nameDayOfChoice = "friday"
        break
      }
      case 5: {
        this.nameDayOfChoice = "saturday"
        break
      }
      case 6: {
        this.nameDayOfChoice = "sunday"
        break
      }
      default: {
        this.nameDayOfChoice = "monday"
      }
    }
    //console.log(this.nameDayOfChoice)
    this.isLoading = true
    setTimeout(() => {
      this.infoService.getAnimeSchedule(this.nameDayOfChoice).subscribe(
        data => {
          this.scheduleData = data[`${this.nameDayOfChoice}`]
          this.isLoading = false
          console.log(this.scheduleData)
        },
        error => {
          console.log(error)
          this.toast.error("Failed to load data from API")
        }
      )


    }, 1000);
  }
  scrollToTop() {
    window.scrollTo(0, 0)
  }


  getDayOfChoice(num: number): number {
    switch (num) {

      case 0: {
        return 6
      }
      case 1: {
        return 0
      }
      case 2: {
        return 1
      }
      case 3: {
        return 2
      }
      case 4: {
        return 3
      }
      case 5: {
        return 4
      }
      case 6: {
        return 5
      }
      default: {
        return 0
      }
    }
  }
  getNameOfWeekday(num: number): string {
    switch (num) {

      case 0: {
        return "sunday"

      }
      case 1: {
        return "monday"
      }
      case 2: {
        return "tuesday"
      }
      case 3: {
        return "wednesday"
      }
      case 4: {
        return "thursday"
      }
      case 5: {
        return "friday"
      }
      case 6: {
        return "saturday"
      }

      default: {
        return ""
      }
    }

  }

 







}
