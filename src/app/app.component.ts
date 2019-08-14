import { Component, OnInit } from '@angular/core';
import { MtaApiService, TrainArrivalDto } from './mta-api.service';
import { timer } from 'rxjs';
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
    timer(0, 45000).subscribe(() => {
      this.mtaApiService.getClintonWashC().subscribe((arrivalDto) => {
        this.clintonWashCArrivals = arrivalDto;
      });

      this.mtaApiService.getClassonG().subscribe((arrivalDto) => {
        this.classonGArrivals = arrivalDto;
      });

      this.mtaApiService.getClintonWashG().subscribe((arrivalDto) => {
        this.clintonWashGArrivals = arrivalDto;
      });
    });
  }
}
