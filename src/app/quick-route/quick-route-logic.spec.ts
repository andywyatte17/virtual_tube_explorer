//
//
//

import { QuickRouteLogic } from "./quick-route-logic";
import { StationNaptanToName, StationNameToNaptan } from "../naptans/naptans";

describe("QuickRouteLogic", () => {
  let originalTimeout;

  beforeEach(() => { });

  // ...

  it("Test 1", () => {
    let qrl = new QuickRouteLogic();
    qrl.add(StationNameToNaptan("Amersham"));
    qrl.add(StationNameToNaptan("Chalfont & Latimer"));
    qrl.pickLineBetweenLastStationPair(0);
    qrl.add(StationNameToNaptan("Chesham"));
    qrl.pickLineBetweenLastStationPair(0);
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    expect(visited.toString()).toEqual("Amersham,Chalfont & Latimer,Chesham");
  });

  // ...

  it("Test 2", () => {
    let qrl = new QuickRouteLogic();
    qrl.add(StationNameToNaptan("Amersham"));
    qrl.add(StationNameToNaptan("Chalfont & Latimer"));
    qrl.pickLineBetweenLastStationPair(0);
    qrl.add(StationNameToNaptan("Chesham"));
    qrl.pickLineBetweenLastStationPair(0);
    qrl.add(StationNameToNaptan("Moor Park"));
    qrl.pickLineBetweenLastStationPair(0);
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    expect(visited.toString()).toEqual("Amersham,Chalfont & Latimer,Chesham,Chorleywood,Moor Park,Rickmansworth");
  });

  // ...

  fit("Test 3", () => {
    let qrl = new QuickRouteLogic();
    // qrl.add(StationNameToNaptan("Walthamstow Central"));
    qrl.add(StationNameToNaptan("Euston"));
    qrl.add(StationNameToNaptan("Edgware"));
    qrl.pickLineBetweenLastStationPair(0);
    let visited = qrl.visited();
    visited = visited.map( (x) => StationNaptanToName(x) );
    const expectedVisited = ["Euston", "Mornington Crescent", "Camden Town", "Chalk Farm", "Belsize Park",
      "Hampstead", "Golders Green", "Brent Cross", "Hendon Central", "Colindale", "Burnt Oak", "Edgware"]
      .map(x => StationNameToNaptan(x))
      .sort()
      .map(x => StationNaptanToName(x))
      .join(",");
    expect(visited.toString()).toEqual(expectedVisited);
  });
  
  // ...
});