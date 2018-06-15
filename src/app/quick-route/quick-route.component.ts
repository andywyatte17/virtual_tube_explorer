import { Component, OnInit } from '@angular/core';
import { MakeTubeNaptans, Naptan, StationNameToNaptan, StationNaptanToName } from '../naptans/naptans';
import { PlacesSvgService } from '../places-svg/places-svg.service';
import { QuickRouteLogic } from './quick-route-logic';
import { RoutesBetweenStations } from '../tfl_api/adjacent-stations';

type LineStation = {
  line: string,
  station: string
};

@Component({
  selector: 'app-quick-route',
  templateUrl: './quick-route.component.html',
  styleUrls: ['./quick-route.component.css']
})
export class QuickRouteComponent implements OnInit {
  constructor(public readonly placesSvgService: PlacesSvgService) { }

  public foundStation: string = null;

  private naptans = MakeTubeNaptans();

  private _stationInput: HTMLInputElement = null;

  private _quickRoute = new QuickRouteLogic();

  ngOnInit() { }

  onStationKeyUp(event: KeyboardEvent) {
    if (!this._stationInput)
      this._stationInput = <HTMLInputElement>document.getElementById("quick_route_station_input");
    if (this._stationInput) {
      this.lookup(this._stationInput.value);
      this.bumpProposedRoute();
    }
  }

  lookup(searchString: string) {
    type MatchesNaptan = { matchingBits: number, naptan: Naptan, isExactMatch: 0 | 1 };
    this.foundStation = null;
    const n = this.naptans;
    let searchBits = searchString.split(' ');
    searchBits = searchBits.map((x) => x.toLowerCase());
    let candidates =
      n.map((nap: Naptan) => {
        let count =
          searchBits
            .map((searchBit: string) => nap.name.toLowerCase().indexOf(searchBit) >= 0)
            .reduce(
              (accum: number, v: boolean) => (v ? (accum + 1) : accum),
              0);
        return {
          matchingBits: count, naptan: nap,
          isExactMatch: searchString.toLowerCase() === nap.name.toLowerCase() ? 1 : 0
        };
      }).filter((count_nap: MatchesNaptan) => count_nap.matchingBits > 0);

    candidates = candidates.sort(
      (a: MatchesNaptan, b: MatchesNaptan) =>
        (b.matchingBits - a.matchingBits) - (a.isExactMatch * 1000) + (b.isExactMatch * 1000)
    );

    if (candidates.length > 0) {
      // console.log(candidates);
      this.foundStation = candidates[0].naptan.name;
    }
  }

  private bumpStationsView() {
    let visited = this._quickRoute.visited();
    visited = visited.map(x => x);
    this.placesSvgService.placesVisitedDidChange.emit(visited);
  }

  onStationEnter(event) {
    if (!this.foundStation)
      return;
    let inputElem = <HTMLInputElement>event.srcElement;
    console.log('event', typeof (event), event);
    console.log(inputElem.value);
    if (this._quickRoute.length < 1)
      this._quickRoute.add(StationNameToNaptan(this.foundStation));
    else {
      this._quickRoute.add(StationNameToNaptan(this.foundStation));
      this._quickRoute.pickLineBetweenLastStationPair(this._routeIndex);
    }
    this.bumpStationsView();
  }

  popLastStation() {
    if (this._quickRoute.length > 0) {
      this._quickRoute.pop();
      this.bumpStationsView();
    }
  }

  get lineStations() {
    return this._quickRoute.lineStations;
  }

  private _routeIndex = 0;
  private _proposedLine = "";

  bumpProposedRoute() {
    if (this._quickRoute.length > 0) {
      let ls = this._quickRoute.lineStations;
      let routes = RoutesBetweenStations(StationNameToNaptan(ls[ls.length - 1].station), StationNameToNaptan(this.foundStation));
      if(routes.length<1) {
        this._routeIndex = 0;
        return;
      }
      this._routeIndex = Math.min(routes.length-1, this._routeIndex);
      this._proposedLine = routes[this._routeIndex].line + "-" + StationNaptanToName(routes[this._routeIndex].naptans[1]);
    }
  }

  incrementRouteIndex(event : KeyboardEvent, n: number) {
    console.log("this._routeIndex", this._routeIndex);
    event.preventDefault();
    this._routeIndex += n;
    if (this._routeIndex < 0) this._routeIndex = 0;
    this.bumpProposedRoute();
  }

  get proposedLine() {
    return this._proposedLine;
  }
}
