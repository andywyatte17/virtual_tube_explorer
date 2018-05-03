import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';

import {Arrival} from '../tfl_api/arrivals';

import {MakeTubeNaptans, Naptan} from './naptans';
import { ApiKeys } from '../my_tfl_api_key';


@Component({
  selector: 'app-naptans',
  templateUrl: './naptans.component.html',
  styleUrls: ['./naptans.component.css']
})
export class NaptansComponent implements OnInit {
  naptans = MakeTubeNaptans();

  arrivals: Array<Arrival> = null;

  selectedNaptan: Naptan;

  selectedNaptanId_: string;

  get selectedNaptanId() {
    return this.selectedNaptanId_;
  }

  set selectedNaptanId(naptanId: string) {
    this.selectedNaptanId_ = naptanId;
    this.selectedNaptan = this.naptans.find((naptan:Naptan) => {
      return naptan.id == naptanId;
    });
  }

  constructor(private http: HttpClient) {
    this.selectedNaptanId = this.naptans[0].id;
  }

  ngOnInit() {
    if (this.selectedNaptan) this.naptanDidChange();
  }

  toMinutes(arrival: Arrival) {
    return (Math.round(arrival.timeToStation / 60.0)).toString() + ' minute(s)';
  }

  naptanDidChange() {
    // Arrivals API
    let api =
        `https://api.tfl.gov.uk/StopPoint/${this.selectedNaptan.id}/arrivals` + ApiKeys.htmlPrefix();

    console.log(api);
    this.http.get<any>(api).subscribe((arrivals: Array<Arrival>) => {
      this.arrivals = arrivals;
    });
  }
}
