//
// passenger.ts
//

import { Naptan } from "../naptans/naptans";
import { HttpClient } from '@angular/common/http';
import { ApiKeys } from "../my_tfl_api_key";
import { Arrival } from "../tfl_api/arrivals";
import { Injectable, EventEmitter } from "@angular/core";

export class PassengerPlaces {
  constructor(public naptan: Naptan, timeFirstAt: string) { }
};

export class CurrentVehicle {
  constructor(public vehicleId: string, public line: string) { }
}

export class Where {
  constructor(public location: string, public timestamp: string) { }
};

/** The state object describing the passenger - for example
 * where it is, where it's been and when.
 */
@Injectable()
export class Passenger {
  public places = new Array<PassengerPlaces>();
  public filteredPlaces = new Array<PassengerPlaces>();
  public wheres = new Array<Where>();
  public currentPlace: Naptan = null;
  public currentVehicle: CurrentVehicle = null;
  public readonly wheresDidChange = new EventEmitter<Passenger>();

  bumpWhereAmI(http: HttpClient) {
    if (!this.currentVehicle) {
      return new Promise<any>(
        (resolve, reject) => { resolve(false); });
    } else {
      //console.log("cv", this.currentVehicle);
      return new Promise<any>(
        (resolve, reject) => {
          let cv = this.currentVehicle;
          //let url = `https://api.tfl.gov.uk/Mode/tube/Arrivals` + ApiKeys.htmlPrefix();
          let url = `https://api.tfl.gov.uk/line/${cv.line}/arrivals` + ApiKeys.htmlPrefix();
          let resolved = false;
          console.log(url);
          http.get<Array<Arrival>>(url).subscribe((arrivals: Array<Arrival>) => {
            let mapper = (a: Arrival) => [a.lineId, a.vehicleId, a];

            console.log("on-line", arrivals.filter((a: Arrival) => a.lineId == cv.line).map(mapper));

            let v = arrivals.filter((a: Arrival) => a.lineId == cv.line);

            console.log("on-vid", arrivals.filter((a: Arrival) => a.vehicleId == cv.vehicleId).map(mapper));

            v = v.filter((a: Arrival) => {
              return a.vehicleId == cv.vehicleId;
            });
            //console.log("v", v.map(mapper));
            let arrival = v.length > 0 ? v[0] : null;
            if (arrival) {
              let lastWhere: Where;
              if (this.wheres.length >= 0)
                lastWhere = this.wheres[this.wheres.length - 1];
              if (!lastWhere || (lastWhere.location != arrival.currentLocation))
                this.wheres.push(
                  new Where(arrival.currentLocation, arrival.timestamp));
              this.wheresDidChange.emit(this);
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
    }
  }
}