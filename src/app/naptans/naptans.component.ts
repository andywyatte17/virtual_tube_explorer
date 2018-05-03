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

  filteredNaptans = new Array<Naptan>();

  arrivals: Array<Arrival> = null;

  selectedNaptan: Naptan;

  selectedNaptanId_: string;

  filter : string;

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
    this.updateFilteredNaptans();
  }

  toMinutes(arrival: Arrival) {
    return (Math.round(arrival.timeToStation / 60.0)).toString() + ' minute(s)';
  }

  filterDidChange(filterValue : string)
  {
    this.filter = filterValue;
    this.updateFilteredNaptans();
  }

  updateFilteredNaptans()
  {
    if(!this.filter || this.filter=='')
    {
      this.filteredNaptans = this.naptans;
      return;
    }
    let filterLC = this.filter.toLowerCase();
    let selectedNaptan = this.selectedNaptan;
    this.filteredNaptans = this.naptans.filter( (naptan : Naptan) => {
      return naptan==selectedNaptan || naptan.name.toLowerCase().indexOf(filterLC)>=0;
    });
  }

  naptanDidChange() {
    // Arrivals API
    let api =
        `https://api.tfl.gov.uk/StopPoint/${this.selectedNaptan.id}/arrivals` + ApiKeys.htmlPrefix();

    console.log(api);
    this.http.get<any>(api).subscribe((arrivals: Array<Arrival>) => {
      this.arrivals = arrivals.sort( (a:Arrival, b:Arrival) => {
        return a.timeToStation - b.timeToStation;
      });
    });
  }
}
