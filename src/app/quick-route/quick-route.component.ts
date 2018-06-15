import { Component, OnInit } from '@angular/core';
import { MakeTubeNaptans, Naptan } from '../naptans/naptans';

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
  constructor() { }

  public readonly lineStations = new Array<LineStation>();

  public foundStation: string = null;

  private naptans = MakeTubeNaptans();

  ngOnInit() { }

  onStationKeyUp(event: KeyboardEvent) {
    let inputElem = <HTMLInputElement>event.srcElement;
    this.lookup(inputElem.value);
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
    let inputElem = <HTMLInputElement>event.srcElement;
    console.log('event', typeof (event), event);
    console.log(inputElem.value);
    if (this.lineStations.length < 1)
      this.lineStations.push({ line: null, station: inputElem.value });
    else
      this.lineStations.push({ line: 'piccadilly', station: inputElem.value });
  }
}
