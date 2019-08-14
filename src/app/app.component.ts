import { Component, OnInit } from '@angular/core';
import { MtaApiService, TrainArrivalDto } from './mta-api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'clinton-hill-mta';
  clintonWashCArrivals: TrainArrivalDto;
  clintonWashGArrivals: TrainArrivalDto;
  classonGArrivals: TrainArrivalDto;

  constructor(private readonly mtaApiService: MtaApiService) { }

  ngOnInit() {
    // this.mtaApiService.getClintonWashC().subscribe((arrivalDto) => {
    //   this.clintonWashCArrivals = arrivalDto;
    // });

    // this.mtaApiService.getClassonG().subscribe((arrivalDto) => {
    //   this.classonGArrivals = arrivalDto;
    // });

    // this.mtaApiService.getClintonWashG().subscribe((arrivalDto) => {
    //   this.clintonWashGArrivals = arrivalDto;
    // });

    this.clintonWashGArrivals = {
      uptownTimes: [10, 20, 30],
      downtownTimes: [10, 20, 30],
      time: 'weeee'
    };

    this.clintonWashCArrivals = {
      uptownTimes: [10, 20, 30],
      downtownTimes: [10, 20, 30],
      time: 'weeee'
    };

    this.classonGArrivals = {
      uptownTimes: [10, 20, 30],
      downtownTimes: [10, 20, 30],
      time: 'weeee'
    };
  }
}
