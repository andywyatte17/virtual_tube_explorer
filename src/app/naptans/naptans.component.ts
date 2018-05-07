import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Arrival } from '../tfl_api/arrivals';

import { MakeTubeNaptans, Naptan } from './naptans';
import { ApiKeys } from '../my_tfl_api_key';
import { MakeTubeLines, TestLinesAPI } from '../tfl_api/lines';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArrivalInfoComponent } from '../arrival-info/arrival-info.component';
import { Passenger, CurrentVehicle } from '../passenger/passenger';
import { PlacesService } from '../places.service';


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

  filter: string;

  lines: Array<string> = null;

  filterLine = new Map<string, boolean>();

  selectedLines = new Array<string>();

  lineSelectedDidChange() {
    this.refreshArrivals();
  }

  get selectedNaptanId() {
    return this.selectedNaptanId_;
  }

  set selectedNaptanId(naptanId: string) {
    this.selectedNaptanId_ = naptanId;
    this.selectedNaptan = this.naptans.find((naptan: Naptan) => {
      return naptan.id == naptanId;
    });
    Naptan.TubeLinesForNaptan(naptanId, this.http).then(
      (lines: Array<string>) => {
        console.log(lines);
        this.lines = lines;
        this.lines.forEach((line: string) => this.setFilterLine(line));
        this.naptanDidChange();
      });
  }

  constructor(private http: HttpClient, private modalService: NgbModal,
    public readonly passenger: Passenger, public readonly placesService: PlacesService) {
    this.selectedNaptanId = this.naptans[0].id;
    //this.passenger.currentVehicle = new CurrentVehicle("204", "hammersmith-city");
  }

  ngOnInit() {
    if (this.selectedNaptan) this.naptanDidChange();
    this.updateFilteredNaptans();
    this.bumpArrivals();
  }

  bumpArrivals() {
    setTimeout(() => {
      this.refreshArrivals();
      this.bumpArrivals();
    }, 1000 * 30);
  }

  toMinutes(arrival: Arrival) {
    return (Math.round(arrival.timeToStation / 60.0)).toString() + ' minute(s)';
  }

  filterDidChange(filterValue: string) {
    this.filter = filterValue;
    this.updateFilteredNaptans();
  }

  updateFilteredNaptans() {
    if (!this.filter || this.filter == '') {
      this.filteredNaptans = this.naptans;
      return;
    }
    let filterLC = this.filter.toLowerCase();
    let selectedNaptan = this.selectedNaptan;
    this.filteredNaptans = this.naptans.filter((naptan: Naptan) => {
      return naptan == selectedNaptan || naptan.name.toLowerCase().indexOf(filterLC) >= 0;
    });
  }

  naptanDidChange() {
    this.refreshArrivals();
  }

  refreshArrivals() {
    let linesStart = this.lines ? this.lines : new Array<string>();
    let arrivals = new Array<Arrival>();
    let linesToUse = linesStart.filter((line: string) => this.isLineFiltered(line));
    let promises = linesToUse.map((line: string) => {
      let naptan = this.selectedNaptanId;
      let url = `https://api.tfl.gov.uk/Line/${line}/Arrivals/${naptan}`;
      url = url + ApiKeys.htmlPrefix();
      console.log(url);
      return new Promise<any>((resolve, reject) => {
        this.http.get<any>(url).subscribe((arrivals2: Array<Arrival>) => {
          arrivals2.forEach((arr) => arrivals.push(arr));
          resolve(true);
        });
      });
    });

    //console.dir({"promises":promises});
    Promise.all(promises).then(
      (value) => {
        this.arrivals = arrivals.sort((a: Arrival, b: Arrival) => {
          return a.timeToStation - b.timeToStation;
        });
      });
    // Old Arrivals API
    // `https://api.tfl.gov.uk/StopPoint/${this.selectedNaptan.id}/arrivals` + ApiKeys.htmlPrefix();
  }

  shortenedDestination(name: string): string {
    if (name) {
      name = name.replace(" Underground Station ", " ");
      name = name.replace(" Underground Station", "");
    }
    return name;
  }

  getClassByLine(lineId: string) {
    return "generic_line " + lineId;
  }

  selectArrival(arrival: Arrival) {
    //const modalRef = this.modalService.open(ArrivalInfoComponent);
    //(<ArrivalInfoComponent>modalRef.componentInstance).arrival = arrival;
    this.placesService.arrivalSelected.emit(arrival);
  }

  toggleFilterLine(line: string) {
    console.log("toggleFilterLine", line);
    if (!this.filterLine.has(line))
      this.filterLine.set(line, false);
    this.filterLine.set(line, !this.filterLine.get(line));
    this.refreshArrivals();
  }

  setFilterLine(line: string) {
    this.filterLine.set(line, true);
  }

  isLineFiltered(line: string) {
    if (!this.filterLine.has(line))
      this.filterLine.set(line, false);
    return this.filterLine.get(line);
  }

  soloLine(event: any, line: string) {
    let not_reverse = true;
    if(this.isLineFiltered(line))
      not_reverse = false;
    let keys = new Array<string>();
    this.filterLine.forEach((v, k: string) => keys.push(k));
    keys.forEach((k: string) => this.filterLine.set(k, not_reverse === (k === line)));
    this.refreshArrivals();
  }

  linesSel(begin: number, end: number) {
    if (!this.lines) return new Array<string>();
    return this.lines.filter((_, index) => begin <= index && index < end);
  }
}
