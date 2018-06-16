//
//
//

import { QuickRouteLogic } from "./quick-route-logic";
import { StationNaptanToName, StationNameToNaptan } from "../naptans/naptans";
import { RoutesBetweenStations } from "../tfl_api/adjacent-stations";

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

  it("Test 3", () => {
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

  it("Test 4 (0)", () => {
    let routes = RoutesBetweenStations(StationNameToNaptan("Baker Street"), StationNameToNaptan("Edgware Road (Circle Line)"));
    expect(routes[0].naptans).toEqual(['940GZZLUBST', '940GZZLUERC']);
  });

  // ...

  it("Test 4 (1)", () => {
    let routes = RoutesBetweenStations(StationNameToNaptan("Baker Street"), StationNameToNaptan("Edgware Road (Circle Line)"));
    expect(routes[1].naptans).toEqual(['940GZZLUESQ',
      '940GZZLUKSX', '940GZZLUFCN', '940GZZLUBBN', '940GZZLUMGT',
      '940GZZLULVT', '940GZZLUALD', '940GZZLUTWH', '940GZZLUMMT',
      '940GZZLUCST', '940GZZLUMSH', '940GZZLUBKF', '940GZZLUTMP',
      '940GZZLUEMB', '940GZZLUWSM', '940GZZLUSJP', '940GZZLUVIC',
      '940GZZLUSSQ', '940GZZLUSKS', '940GZZLUGTR', '940GZZLUHSK',
      '940GZZLUNHG', '940GZZLUBWT', '940GZZLUPAC', '940GZZLUERC']);
  });

  // ...

});