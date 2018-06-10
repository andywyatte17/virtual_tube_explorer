//
// adjacent-stations.ts
//

import { MakeTubeNaptans, Naptan } from "../naptans/naptans";
// ...
import { northern1, northern2, northern3 } from './adjacent-stations-northern';
import { hammersmith } from './adjacent-stations-hammersmith-city';
import { metropolitan1, metropolitan2, metropolitan3, metropolitan4 } from './adjacent-stations-metropolitan';
import { victoria } from "./adjacent-stations-victoria";
import { jubilee } from "./adjacent-stations-jubilee";
import { piccadilly1 } from "./adjacent-stations-piccadilly";
import { central2, central1 } from "./adjacent-stations-central";
import { district1, district2, district3 } from "./adjacent-stations-district";
import { bakerloo } from "./adjacent-stations-bakerloo";
import { circle1 } from "./adjacent-stations-circle";
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
  // ...
  {line:"district", stations:district1 },
  {line:"district", stations:district2 },
  {line:"district", stations:district3 },
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
  // ...
  {line:"victoria", stations:victoria },
  // ...
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