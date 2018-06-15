//
// quick-route-logic.ts
//

import { adjacentStations, LineStations, RoutesBetweenStations } from "../tfl_api/adjacent-stations";
import { MakeTubeNaptans, Naptan, StationNameToNaptan, StationNaptanToName } from "../naptans/naptans";

type NaptanLine = { naptan: string, lineFromLastToHere: string, routeIndex: number };

function unique<T>(sa: Array<T>) {
  let first = 0;
  let last = sa.length;
  if (first == last) return sa;
  let result = first;
  while (true) {
    first += 1;
    if (first === last)
      break;
    if (!(sa[result] === sa[first]))  // or: if (!pred(*result,*first)) for version (2)
    {
      result += 1;
      sa[result] = sa[first];
    }
  }
  result += 1;
  return sa.slice(0, result);
}

export class QuickRouteLogic {
  private _naptansLines = Array<NaptanLine>();

  add(naptan: string) {
    this._naptansLines.push({
      naptan: naptan,
      lineFromLastToHere: <string>null,
      routeIndex: 0
    });
  }

  pop() {
    this._naptansLines.pop();
  }

  pickLineBetweenLastStationPair(routeIndex: number) {
    if (this._naptansLines.length > 1) {
      const n = this._naptansLines.length - 2;
      const a = this._naptansLines[n].naptan;
      const b = this._naptansLines[n + 1].naptan;
      let routes = RoutesBetweenStations(a, b);
      if (0 <= routeIndex && routeIndex < routes.length) {
        this._naptansLines[n + 1].routeIndex = routeIndex;
        this._naptansLines[n + 1].lineFromLastToHere = routes[routeIndex].line;
        return;
      }
      if (routes.length > 0) {
        this._naptansLines[n + 1].routeIndex = 0;
        this._naptansLines[n + 1].lineFromLastToHere = routes[0].line;
        return;
      }
      if (routes.length < 1) {
        this._naptansLines[n + 1].routeIndex = 0;
        this._naptansLines[n + 1].lineFromLastToHere = "walk";
      }
    }
  }

  get length(): number {
    return this._naptansLines.length;
  }

  get lineStations() {
    return this._naptansLines.map(v => ({
      line: v.lineFromLastToHere,
      station: StationNaptanToName(v.naptan)
    }));
  }

  visited(): Array<string> {
    if (this._naptansLines.length < 1) return null;

    const ToNaptans = (ls: LineStations) => {
      let stations = ls.stations
        .split("\n")
        .map((name: string) => StationNameToNaptan(name));
      let line = ls.line;
      return { stations: stations, line: line };
    };

    const adjacentStations2 = adjacentStations.map(
      (ls: LineStations) => {
        return ToNaptans(ls);
      }
    );

    let visited = new Array<string>();
    let currentNaptan = this._naptansLines[0].naptan;

    for (let naptanLine of this._naptansLines) {
      const nextNaptan = naptanLine.naptan;
      const lineToNext = naptanLine.lineFromLastToHere;
      let ProcessRoute = () => {
        for (let x of adjacentStations2) {
          if (x.line !== lineToNext) continue;
          let ixCurrent = x.stations.indexOf(currentNaptan);
          let ixNext = x.stations.indexOf(nextNaptan);
          if (ixCurrent >= 0 && ixNext >= 0) {
            for (let station of x.stations.slice(Math.min(ixCurrent, ixNext), Math.max(ixCurrent, ixNext) + 1)) {
              visited.push(station);
            }
            return true;
          }
        }
        return false;
      };
      ProcessRoute();
      currentNaptan = nextNaptan;
    }

    let sorted = visited.sort((a: string, b: string) => (a < b ? -1 : b < a ? 1 : 0));
    sorted = unique(sorted);

    return sorted;
  }
};
