import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Arrival } from '../tfl_api/arrivals';

import { MakeTubeNaptans, Naptan } from './naptans';
import { ApiKeys } from '../my_tfl_api_key';
import { MakeTubeLines, TestLinesAPI } from '../tfl_api/lines';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArrivalInfoComponent } from '../arrival-info/arrival-info.component';
import { Passenger, CurrentVehicle } from '../passenger/passenger';


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

  get selectedNaptanId() {
    return this.selectedNaptanId_;
  }

  set selectedNaptanId(naptanId: string) {
    this.selectedNaptanId_ = naptanId;
    this.selectedNaptan = this.naptans.find((naptan: Naptan) => {
      return naptan.id == naptanId;
    });
  }

  private bumpWhereAmI() {
    console.log("bumpWhereAmI", new Date());
    this.passenger.bumpWhereAmI(this.http).then(
      () => setTimeout(() => this.bumpWhereAmI(), 15000)
    );
  }

  constructor(private http: HttpClient, private modalService: NgbModal,
    public readonly passenger: Passenger) {
    this.selectedNaptanId = this.naptans[0].id;
    //this.passenger.currentVehicle = new CurrentVehicle("204", "hammersmith-city");
    this.bumpWhereAmI();
  }

  ngOnInit() {
    if (this.selectedNaptan) this.naptanDidChange();
    this.updateFilteredNaptans();
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

  private pendingVehicleId = null;
  private pendingLine = null;

  lineDidChange(line: string) {
    this.pendingLine = line;
  }

  vehicleIdDidChange(vehicleId: string) {
    this.pendingVehicleId = vehicleId;
  }

  setVehicleId() {
    if (this.pendingVehicleId) {
      this.passenger.currentVehicle = new CurrentVehicle(this.pendingVehicleId, this.pendingLine);
      console.log("this.passenger.currentVehicle", this.passenger.currentVehicle);
    }
  }

  naptanDidChange() {
    //MakeTubeLines().forEach((line: string) => {
    //  TestLinesAPI(this.http, line);
    //});

    let linesPromise = Naptan.TubeLinesForNaptan(this.selectedNaptanId, this.http);
    linesPromise.then( (lines : Array<string>) => {
      //console.log("lines", lines);
      let arrivals = new Array<Arrival>();
      let promises = lines.map( (line:string) => {
        let naptan = this.selectedNaptanId;
        let url = `https://api.tfl.gov.uk/Line/${line}/Arrivals/${naptan}`;
        url = url + ApiKeys.htmlPrefix();
        console.log(url);
        return new Promise<any>( (resolve, reject) => {
          this.http.get<any>(url).subscribe( (arrivals2:Array<Arrival>) => {
            arrivals2.forEach( (arr) => arrivals.push(arr) );
            resolve(true);
          });
        });
      });
      //console.dir({"promises":promises});
      Promise.all( promises ).then(
        (value) => {
          this.arrivals = arrivals.sort((a: Arrival, b: Arrival) => {
            return a.timeToStation - b.timeToStation;
          });
        });
    });

    // Old Arrivals API
    // `https://api.tfl.gov.uk/StopPoint/${this.selectedNaptan.id}/arrivals` + ApiKeys.htmlPrefix();
  }

  shortenedDestination(name: string): string {
    //name = name.replace(" Underground Station ", " ");
    //name = name.replace(" Underground Station", "");
    return name;
  }

  showArrival(arrival: Arrival) {
    const modalRef = this.modalService.open(ArrivalInfoComponent);
    (<ArrivalInfoComponent>modalRef.componentInstance).arrival = arrival;
  }
}
