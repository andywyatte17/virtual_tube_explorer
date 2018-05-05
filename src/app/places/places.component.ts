import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Passenger, CurrentVehicle, Where } from '../passenger/passenger';
import { PlacesService } from '../places.service';
import { Arrival } from '../tfl_api/arrivals';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {

  public pendingVehicleId: string = null;
  public pendingLine: string = null;
  public filteredWheres = new Array<Where>();
  
  constructor(private http: HttpClient, private modalService: NgbModal,
    public readonly passenger: Passenger, public readonly placesService: PlacesService) {
    this.bumpWhereAmI();
    // ...
    this.placesService.arrivalSelected.subscribe((arrival: Arrival) => {
      this.pendingLine = arrival.lineId;
      this.pendingVehicleId = arrival.vehicleId;
    });
    // ...
    this.passenger.wheresDidChange.subscribe( (passenger : Passenger) => {
      let last = passenger.wheres.length-1;
      this.filteredWheres = passenger.wheres.filter( (v : any, index : number) => {
        return index==last;
      });
    });
  }
  
  ngOnInit() {
  }

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

  private bumpWhereAmI() {
    console.log("bumpWhereAmI", new Date());
    this.passenger.bumpWhereAmI(this.http).then(
      () => setTimeout(() => this.bumpWhereAmI(), 15000)
    );
  }
}
