//
// quick-route-logic.ts
//

import { adjacentStations, LineStations } from "../tfl_api/adjacent-stations";
import { MakeTubeNaptans, Naptan, NameToNaptan } from "../naptans/naptans";

type NaptanLine = { naptan: string, lineFromLastToHere: string };

function unique<T>(sa:Array<T>) {
  let first = 0;
  let last = sa.length;
  if (first==last) return sa;
  let result = first;
  while(true)
  {
    first+=1;
    if(first === last)
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

  add(naptan: string, line: string = null) {
    this._naptansLines.push({ naptan: naptan, lineFromLastToHere: line });
  }

  visited() : Array<string>
  {
    if(this._naptansLines.length<1)
      return null;

    const ToNaptans = (ls: LineStations) => {
      let stations = ls.stations.split("\n").map(
        (name: string) => NameToNaptan(name)
      );
      let line = ls.line;
      return { stations: stations, line: line };
    };

    const adjacentStations2 = adjacentStations.map(
      (ls: LineStations) => {
        return ToNaptans(ls);
      });

    let visited = new Array<string>();
    let currentNaptan = this._naptansLines[0].naptan;

    for (let naptanLine of this._naptansLines) {
      const nextNaptan = naptanLine.naptan;
      const lineToNext = naptanLine.lineFromLastToHere;
      let ProcessRoute = () => {
        for (let x of adjacentStations2) {
          if (x.line !== lineToNext)
            continue;
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

    let sorted = visited.sort((a: string, b: string) => a < b ? -1 : b < a ? 1 : 0);
    sorted = unique(sorted);

    return sorted;
  }
};
