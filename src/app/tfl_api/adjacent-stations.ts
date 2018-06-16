//
// adjacent-stations.ts
//

import { MakeTubeNaptans, Naptan, StationNaptanToName, StationNameToNaptan } from "../naptans/naptans";
// ...
import { northern1, northern2, northern3 } from './adjacent-stations-northern';
import { hammersmith } from './adjacent-stations-hammersmith-city';
import { metropolitan1, metropolitan2, metropolitan3, metropolitan4 } from './adjacent-stations-metropolitan';
import { victoria } from "./adjacent-stations-victoria";
import { jubilee } from "./adjacent-stations-jubilee";
import { piccadilly1, piccadilly2 } from "./adjacent-stations-piccadilly";
import { central2, central1, central3 } from "./adjacent-stations-central";
import { district1, district2, district3, district4 } from "./adjacent-stations-district";
import { bakerloo } from "./adjacent-stations-bakerloo";
import { circle1 } from "./adjacent-stations-circle";
import { waterloo_city_1 } from "./adjacent-stations-wateroo-city";
// ...

export type LineStations = { line: string, stations: string };

export const adjacentStations: Array<LineStations> = [
  // ...
  {line:"bakerloo", stations:bakerloo },
  // ...
  {line:"circle", stations:circle1 },
  // ...
  {line:"central", stations:central1 },
  {line:"central", stations:central2 },
  {line:"central", stations:central3 },
  // ...
  {line:"district", stations:district1 },
  {line:"district", stations:district2 },
  {line:"district", stations:district3 },
  {line:"district", stations:district4 },
  // ...
  {line:"hammersmith-city", stations:hammersmith },
  // ...
  {line:"jubilee", stations:jubilee},
  // ...
  {line:"metropolitan", stations:metropolitan1 },
  {line:"metropolitan", stations:metropolitan2 },
  {line:"metropolitan", stations:metropolitan3 },
  {line:"metropolitan", stations:metropolitan4 },
  // ...
  {line:"northern", stations:northern1 },
  {line:"northern", stations:northern2 },
  {line:"northern", stations:northern3 },
  // ...
  {line:"piccadilly", stations:piccadilly1 },
  {line:"piccadilly", stations:piccadilly2 },
  // ...
  {line:"victoria", stations:victoria },
  // ...
  {line:"waterloo-city", stations:waterloo_city_1}
];

export function Check() : Array<string> {
  const naptans = MakeTubeNaptans();
  let result = [];
  adjacentStations.forEach(
    (ls: LineStations) => {
      const s = ls.stations;
      s.split("\n").forEach((name: string) => {
        const found = naptans.find((value: Naptan) => value.name == name);
        if (!found)
          result.push(name);
      });
    });
  return result;
}

/**
 * Extend the naptans list from TFL APIs (ie timetable) with our
 * lists of stations on lines. This is used to work around
 * limitations in TFL API data.
 * @param naptans Input list (naptans) with additional stations added.
 *   Stations will have been added where they rightly appear on,
 *   say, the tube map.
 * @param line Line such as piccadilly or central
 * @returns Input list (naptans) with additional stations added.
 *   Stations will have been added where they rightly appear on,
 *   say, the tube map.
 */
export function ExtendNaptansVisitedFromTFL(naptans : Array<string>, line : string) : Array<string>
{
  let result : Array<string> = null;
  const first = naptans[0];
  const firstN = StationNaptanToName(first);
  const last = naptans[naptans.length-1];
  const lastN = StationNaptanToName(last);

  adjacentStations.forEach(
    (lineStations: LineStations) => {
      if (result)
        return;
      if (lineStations.stations.indexOf(firstN) >= 0 &&
        lineStations.stations.indexOf(lastN) >= 0) {
        let stationsNames = lineStations.stations.split("\n");
        let stationsNaptans = stationsNames.map((st) => StationNameToNaptan(st));
        const firstIx = stationsNaptans.findIndex((value: string) => first == value);
        const lastIx = stationsNaptans.findIndex((value: string) => last == value);
        if (firstIx < 0 || lastIx < 0)
          return;
        if (firstIx < lastIx)
          result = stationsNaptans.filter((_, index: number) => firstIx <= index && index <= lastIx);
        else if (lastIx < firstIx) {
          result = stationsNaptans.filter((_, index: number) => lastIx <= index && index <= firstIx);
          result = result.reverse();
        }
      }
    });

  if(result) return result;
  return naptans;
}

export function RoutesBetweenStations(naptan1: string, naptan2: string) {
  const first = naptan1;
  const last = naptan2;
  const firstN = StationNaptanToName(first);
  const lastN = StationNaptanToName(last);
  type T = { naptans: Array<string>, line: string };
  let results = new Array<T>();

  const Pass = (lineStations : LineStations) => {
    const ix1 = lineStations.stations.indexOf(firstN);
    const ix2 = lineStations.stations.indexOf(lastN);
    if (ix1>=0 && ix2>=0) {
      let stationsNames = lineStations.stations.split("\n");
      let stationsNaptans = stationsNames.map((st) => StationNameToNaptan(st));
      const firstIx = stationsNaptans.findIndex((value: string) => first == value);
      const lastIx = stationsNaptans.findIndex((value: string) => last == value);
      if (firstIx < 0 || lastIx < 0)
        return;
      let result = new Array<string>();
      if (firstIx < lastIx)
        result = stationsNaptans.filter((_, index: number) => firstIx <= index && index <= lastIx);
      else if (lastIx < firstIx) {
        result = stationsNaptans.filter((_, index: number) => lastIx <= index && index <= firstIx);
        result = result.reverse();
      }
      return { naptans: result, line: lineStations.line };
    }
    return null;
  };

  for (let lineStations of adjacentStations) {
    let result = Pass(lineStations);
    if(!result)
      continue;
    results.push(result);
    // Handle reverse case - this is for odd lines like 'circle'
    let ls2 = {
      line: lineStations.line,
      stations: lineStations.stations.split("\n").reverse().join("\n")
    };
    let result2 = Pass(ls2);
    if (result2 && result2.naptans.slice().reverse() !== result.naptans)
      results.push(result2);
  }
  return results;
}