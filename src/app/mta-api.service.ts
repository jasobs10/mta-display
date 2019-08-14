import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const G_FEED_ID = '31';
const ACE_FEED_ID = '26';
const AC_N = 'A44N';
const AC_S = 'A44S';
const CLINTON_WASH_G_N = 'G35N';
const CLINTON_WASH_G_S = 'G35S';
const CLASSON_G_N = 'G34N';
const CLASSON_G_S = 'G34S';


export interface TrainArrivalDto {
  uptownTimes: number[];
  downtownTimes: number[];
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class MtaApiService {

  constructor(private readonly httpClient: HttpClient) { }

  getClintonWashG() {
    return this.getTrainArrivalData(G_FEED_ID, CLINTON_WASH_G_N, CLINTON_WASH_G_S);
  }

  getClintonWashC() {
    return this.getTrainArrivalData(ACE_FEED_ID, AC_N, AC_S);
  }

  getClassonG() {
    return this.getTrainArrivalData(G_FEED_ID, CLASSON_G_N, CLASSON_G_S);
  }

  private getTrainArrivalData(feedId, uptown, downtown) {
    return this.httpClient.get<TrainArrivalDto>(`/api/feed/${feedId}`, { params: { uptown, downtown } });
  }
}
