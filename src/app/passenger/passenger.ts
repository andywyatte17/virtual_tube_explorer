//
// passenger.ts
//

import { Naptan } from "../naptans/naptans";
import { HttpClient } from '@angular/common/http';
import { ApiKeys } from "../my_tfl_api_key";
import { Arrival } from "../tfl_api/arrivals";
import { Injectable, EventEmitter } from "@angular/core";
import { NotifierService } from "../notifier.service";
import * as lodash from 'lodash';

export class PassengerPlace {
  constructor(public arrival: Arrival, public details: string) { }
  detailsDidChange(s: string) {
    this.details = s;
    PassengerPlace.detailsDidChangeEvent.emit(this);
  }
  locationDidChange(s: string) {
    (<any>this.arrival).currentLocation = s;
  } 
  static detailsDidChangeEvent = new EventEmitter<PassengerPlace>();
}

export class CurrentVehicle {
  constructor(public vehicleId: string, public line: string) { }
}

/** The state object describing the passenger - for example
 * where it is, where it's been and when.
 */
@Injectable()
export class Passenger {
  private lastNotification: Notification;
  public places = new Array<PassengerPlace>();
  public filteredPlaces = new Array<PassengerPlace>();
  public currentPlace: Naptan = null;
  public currentVehicle: CurrentVehicle = null;
  public readonly wheresDidChange = new EventEmitter<Passenger>();

  constructor(public readonly notifier: NotifierService) { }

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

            //console.log("on-line", arrivals.filter((a: Arrival) => a.lineId == cv.line).map(mapper));
            let v = arrivals.filter((a: Arrival) => a.lineId == cv.line);
            //console.log("on-vid", arrivals.filter((a: Arrival) => a.vehicleId == cv.vehicleId).map(mapper));

            v = v.filter((a: Arrival) => {
              return a.vehicleId == cv.vehicleId;
            });
            //console.log("v", v.map(mapper));
            let arrival = v.length > 0 ? v[0] : null;
            if (arrival) {
              let lastPlace: PassengerPlace;
              if (this.places.length >= 0)
                lastPlace = this.places[this.places.length - 1];
              if (!lastPlace || (lastPlace.arrival.currentLocation != arrival.currentLocation)) {
                this.places.push(new PassengerPlace(arrival, ""));
                this.bumpFilteredPlaces();
                try {
                  let curLoc = arrival.currentLocation;
                  if (curLoc.startsWith("At ")) {
                    if (this.lastNotification)
                      this.lastNotification.close();
                    this.lastNotification = this.notifier.notify(curLoc);
                  }
                } catch (e) { }
              }
              this.wheresDidChange.emit(this);
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
    }
  }

  bumpFilteredPlaces() {
    let lastIndex = this.places.length - 1;
    console.dir(this.places[lastIndex]);
    this.filteredPlaces = this.places.filter((pp: PassengerPlace, index: number) => {
      return index == lastIndex || pp.arrival.currentLocation.startsWith("At ");
    });
  }

  addOther(minutes: number) {
    if (this.places.length > 0) {
      let last = this.places[this.places.length - 1];
      let d2 = new Date(last.arrival.timestamp);
      d2.setTime( d2.getTime() + (minutes * 60 * 1000) );
      let pp = new PassengerPlace(lodash.cloneDeep(last.arrival), "");
      (<any>pp.arrival).timestamp = d2.toISOString();
      this.places.push(pp);
      this.bumpFilteredPlaces();
    }
  }
}