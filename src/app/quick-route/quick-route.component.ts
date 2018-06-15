import { Component, OnInit } from '@angular/core';
import { MakeTubeNaptans, Naptan, NameToNaptan } from '../naptans/naptans';
import { PlacesSvgService } from '../places-svg/places-svg.service';

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
  constructor(public readonly placesSvgService : PlacesSvgService) {}

  public readonly lineStations = new Array<LineStation>();

  public foundStation: string = null;

  private naptans = MakeTubeNaptans();

  private _stationInput : HTMLInputElement = null;

  ngOnInit() { }

  onStationKeyUp(event: KeyboardEvent) {
    if (!this._stationInput)
      this._stationInput = <HTMLInputElement>document.getElementById("quick_route_station_input");
    if (this._stationInput) {
      this.lookup(this._stationInput.value);
    }
  }

  lookup(searchString: string) {
    type CountNap = [number, Naptan];
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
        return [count, nap];
      }).filter((count_nap: CountNap) => count_nap[0] > 0);
    candidates = candidates.sort((a: CountNap, b: CountNap) => b[0] - a[0]);
    if (candidates.length > 0) {
     // console.log(candidates);
     this.foundStation = (<CountNap>candidates[0])[1].name;
    }
  }

  onStationEnter(event) {
    if(!this.foundStation)
      return;
    let inputElem = <HTMLInputElement>event.srcElement;
    console.log('event', typeof (event), event);
    console.log(inputElem.value);
    if (this.lineStations.length < 1)
      this.lineStations.push({ line: null, station: this.foundStation });
    else
      this.lineStations.push({ line: 'piccadilly', station: this.foundStation });

    this.placesSvgService.placesVisitedDidChange.emit(
      this.lineStations.map((x: LineStation) => NameToNaptan(x.station));
  }
}
