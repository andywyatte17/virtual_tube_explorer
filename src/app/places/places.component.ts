import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Passenger, CurrentVehicle } from '../passenger/passenger';
import { PlacesService } from '../places.service';
import { Arrival } from '../tfl_api/arrivals';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  constructor(private http: HttpClient, private modalService: NgbModal,
    public readonly passenger: Passenger, public readonly placesService: PlacesService) {
    this.bumpWhereAmI();
    // ...
    this.placesService.arrivalSelected.subscribe((arrival: Arrival) => {
      this.passenger.currentVehicle = new CurrentVehicle(arrival.vehicleId, arrival.lineId);
    });
    // ...
    this.passenger.wheresDidChange.subscribe((passenger: Passenger) => {
    });
  }

  ngOnInit() {
  }

  private bumpWhereAmI() {
    console.log("bumpWhereAmI", new Date());
    this.passenger.bumpWhereAmI(this.http).then(
      () => setTimeout(() => this.bumpWhereAmI(), 15000)
    );
  }

  public simplifyTimestamp(timestamp: string) {
    let d = new Date(timestamp);
    let s = d.toLocaleTimeString("en-GB", { timeZone: "Europe/London" });
    return s;
    // return `${d2.getHours()}:${d2.getMinutes()}`;
  }

  getCurrentVehicle(): string {
    if (!this.passenger.currentVehicle)
      return '';
    let s = !this.passenger.currentVehicle.line ? '' : this.passenger.currentVehicle.line + " ";
    s += "(" + !this.passenger.currentVehicle.vehicleId ? '?' : this.passenger.currentVehicle.vehicleId + ")";
    return s;
  }

  clearVehicle() { this.passenger.currentVehicle = null; }
}
